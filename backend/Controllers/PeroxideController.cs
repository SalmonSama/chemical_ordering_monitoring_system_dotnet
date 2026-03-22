using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;
using System.Text.Json;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin,focal_point,user")]
public class PeroxideController : ControllerBase
{
    private readonly AppDbContext _db;

    public PeroxideController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/peroxide/lots
    [HttpGet("lots")]
    public async Task<IActionResult> GetPeroxideLots()
    {
        var lots = await _db.InventoryLots
            .Include(l => l.Item)
            .Include(l => l.Lab)
            .Include(l => l.Location)
            .Where(l => l.Item.RequiresPeroxideMonitoring && l.Status != "consumed" && l.Status != "disposed" && l.Status != "expired")
            .Select(l => new
            {
                l.Id,
                l.LotNumber,
                l.Item.ItemName,
                l.Item.PeroxideClass,
                LabName = l.Lab.Name,
                LocationName = l.Location.Name,
                l.OpenDate,
                l.FirstInspectDate,
                l.LastMonitorDate,
                l.NextMonitorDate,
                l.PeroxideStatus,
                l.QuantityRemaining,
                l.Unit,
                l.Status,
                DaysUntilDue = l.NextMonitorDate.HasValue ? (int)(l.NextMonitorDate.Value.Date - DateTime.UtcNow.Date).TotalDays : (int?)null
            })
            .OrderBy(l => l.DaysUntilDue.HasValue ? l.DaysUntilDue.Value : int.MaxValue)
            .ToListAsync();

        return Ok(lots);
    }

    // GET: api/peroxide/tests/{lotId}
    [HttpGet("tests/{lotId}")]
    public async Task<IActionResult> GetTestsForLot(Guid lotId)
    {
        var tests = await _db.PeroxideTests
            .Include(pt => pt.TestedByUser)
            .Where(pt => pt.InventoryLotId == lotId)
            .OrderByDescending(pt => pt.TestDate)
            .Select(pt => new
            {
                pt.Id,
                pt.TestDate,
                pt.ResultType,
                pt.PpmResult,
                pt.ResultText,
                pt.Classification,
                pt.Notes,
                TestedBy = pt.TestedByUser.FullName,
                pt.CreatedAt
            })
            .ToListAsync();

        return Ok(tests);
    }

    // POST: api/peroxide/tests
    [HttpPost("tests")]
    [Authorize(Roles = "admin,focal_point")]
    public async Task<IActionResult> LogTest([FromBody] PeroxideTestRequest request)
    {
        var lot = await _db.InventoryLots
            .Include(l => l.Item)
            .FirstOrDefaultAsync(l => l.Id == request.InventoryLotId);

        if (lot == null) return NotFound(new { error = "Lot not found" });
        if (lot.Status == "consumed" || lot.Status == "disposed")
            return BadRequest(new { error = "Cannot log tests for consumed or disposed lots." });
            
        var user = await _db.Users.FindAsync(request.TestedByUserId);
        if (user == null) return BadRequest(new { error = "User not found." });

        var test = new PeroxideTest
        {
            Id = Guid.NewGuid(),
            InventoryLotId = request.InventoryLotId,
            TestDate = request.TestDate ?? DateTime.UtcNow,
            TestedByUserId = request.TestedByUserId,
            TestMethod = request.TestMethod,
            ResultType = request.ResultType,
            PpmResult = request.PpmResult,
            ResultText = request.ResultText,
            VisualObservations = request.VisualObservations,
            Notes = request.Notes
        };

        // Determine Classification
        if (test.ResultType == "NUMERIC")
        {
            if (test.PpmResult < 25) test.Classification = "Normal";
            else if (test.PpmResult >= 25 && test.PpmResult <= 100) test.Classification = "Warning";
            else test.Classification = "Quarantine";
        }
        else
        {
            // For textual, classification must be provided or defaults to Normal
            test.Classification = request.Classification ?? "Normal";
        }

        // Calculate next due date automatically (e.g. 6 months for Normal, 3 months for Warning)
        if (test.Classification == "Normal")
        {
            test.NextMonitorDue = test.TestDate.AddMonths(6);
            lot.NextMonitorDate = test.NextMonitorDue;
            lot.PeroxideStatus = "Normal";
        }
        else if (test.Classification == "Warning")
        {
            test.NextMonitorDue = test.TestDate.AddMonths(3);
            lot.NextMonitorDate = test.NextMonitorDue;
            lot.PeroxideStatus = "Warning";
        }
        else if (test.Classification == "Quarantine")
        {
            test.NextMonitorDue = null;
            lot.NextMonitorDate = null;
            lot.PeroxideStatus = "Quarantine";
            lot.Status = "quarantined"; // Block checkout
        }

        lot.LastMonitorDate = test.TestDate;
        if (!lot.FirstInspectDate.HasValue)
        {
            lot.FirstInspectDate = test.TestDate;
        }

        if (request.SetOpenDate.HasValue && !lot.OpenDate.HasValue)
        {
            lot.OpenDate = request.SetOpenDate.Value;
        }

        _db.PeroxideTests.Add(test);

        var txn = new StockTransaction
        {
            Id = Guid.NewGuid(),
            TransactionType = "PEROXIDE_TEST_LOGGED",
            ItemId = lot.ItemId,
            LotId = lot.Id,
            LabId = lot.LabId,
            LocationId = lot.LocationId,
            UserId = request.TestedByUserId,
            UserName = user.FullName,
            Quantity = lot.QuantityRemaining,
            CreatedAt = DateTime.UtcNow,
            Notes = $"Peroxide test logged via {test.ResultType}. Result: {test.Classification}",
            Metadata = JsonSerializer.Serialize(new
            {
                testId = test.Id,
                ppm = test.PpmResult,
                classification = test.Classification
            })
        };
        _db.StockTransactions.Add(txn);

        if (test.Classification == "Quarantine")
        {
             var qTxn = new StockTransaction
             {
                 Id = Guid.NewGuid(),
                 TransactionType = "LOT_QUARANTINED",
                 ItemId = lot.ItemId,
                 LotId = lot.Id,
                 LabId = lot.LabId,
                 LocationId = lot.LocationId,
                 UserId = request.TestedByUserId,
                 UserName = user.FullName,
                 Quantity = lot.QuantityRemaining,
                 CreatedAt = DateTime.UtcNow,
                 Notes = "Lot quarantined due to high peroxide levels."
             };
             _db.StockTransactions.Add(qTxn);
        }

        await _db.SaveChangesAsync();

        return Ok(new { message = "Test logged successfully", testId = test.Id, lotStatus = lot.Status, peroxideStatus = lot.PeroxideStatus });
    }
}

public class PeroxideTestRequest
{
    public Guid InventoryLotId { get; set; }
    public DateTime? TestDate { get; set; }
    public Guid TestedByUserId { get; set; }
    public string? TestMethod { get; set; }
    public string ResultType { get; set; } = "NUMERIC";
    public decimal? PpmResult { get; set; }
    public string? ResultText { get; set; }
    public string? Classification { get; set; }
    public string? VisualObservations { get; set; }
    public string? Notes { get; set; }
    public DateTime? SetOpenDate { get; set; }
}
