using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;
using System.Text.Json;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShelfLifeController : ControllerBase
{
    private readonly AppDbContext _db;

    public ShelfLifeController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/shelflife/lookup/{lotNumber}
    [HttpGet("lookup/{lotNumber}")]
    [Authorize(Roles = "admin,focal_point,user")]
    public async Task<IActionResult> LookupLot(string lotNumber)
    {
        var lot = await _db.InventoryLots
            .Include(l => l.Item)
            .Include(l => l.Item.Category)
            .Include(l => l.Lab)
            .Include(l => l.Location)
            .Include(l => l.Vendor)
            .FirstOrDefaultAsync(l => l.LotNumber == lotNumber);

        if (lot == null) return NotFound(new { error = "Inventory lot not found." });

        if (lot.Item.Category == null || lot.Item.Category.Code != "CHEM")
            return BadRequest(new { error = "Only Chemical & Reagent items can have their shelf life extended." });

        if (lot.Status == "quarantined")
            return BadRequest(new { error = "This lot is quarantined and cannot have its shelf life extended." });

        if (lot.Status == "consumed" || lot.Status == "disposed")
            return BadRequest(new { error = $"Cannot extend shelf life for a lot with status: {lot.Status}." });

        int? daysToExpiry = null;
        if (lot.ExpiryDate.HasValue)
        {
            daysToExpiry = (int)(lot.ExpiryDate.Value.Date - DateTime.UtcNow.Date).TotalDays;
        }

        return Ok(new
        {
            id = lot.Id,
            itemId = lot.ItemId,
            itemName = lot.Item.ItemName,
            labName = lot.Lab.Name,
            locationName = lot.Location.Name,
            vendorName = lot.Vendor?.Name,
            lotNumber = lot.LotNumber,
            quantityRemaining = lot.QuantityRemaining,
            unit = lot.Unit,
            expiryDate = lot.ExpiryDate,
            daysToExpiry,
            status = lot.Status,
            extensionCount = lot.ExtensionCount,
            openDate = lot.OpenDate
        });
    }

    // GET: api/shelflife/history/{lotId}
    [HttpGet("history/{lotId}")]
    [Authorize(Roles = "admin,focal_point,user")]
    public async Task<IActionResult> GetHistory(Guid lotId)
    {
        var history = await _db.ShelfLifeExtensions
            .Include(x => x.AuthorizedByUser)
            .Where(x => x.InventoryLotId == lotId)
            .OrderByDescending(x => x.ExtensionNumber)
            .Select(x => new
            {
                x.Id,
                x.ExtensionNumber,
                x.PreviousExpiryDate,
                x.NewExpiryDate,
                x.PreviousDaysToExpiry,
                x.NewDaysToExpiry,
                x.ExtensionDays,
                x.Reason,
                x.TestPerformed,
                x.TestResult,
                x.TestDate,
                AuthorizedBy = x.AuthorizedByUser.FullName,
                x.CreatedAt
            })
            .ToListAsync();

        return Ok(history);
    }

    // POST: api/shelflife/extend
    [HttpPost("extend")]
    [Authorize(Roles = "admin,focal_point")]
    public async Task<IActionResult> ExtendShelfLife([FromBody] ExtendShelfLifeRequest request)
    {
        var lot = await _db.InventoryLots
            .Include(l => l.Item)
            .FirstOrDefaultAsync(l => l.Id == request.InventoryLotId);

        if (lot == null) return NotFound(new { error = "Inventory lot not found." });

        if (lot.Status == "quarantined" || lot.Status == "consumed" || lot.Status == "disposed")
            return BadRequest(new { error = $"Cannot extend shelf life for a lot with status: {lot.Status}." });

        if (request.NewExpiryDate <= (lot.ExpiryDate ?? DateTime.UtcNow))
            return BadRequest(new { error = "New expiry date must be after the current expiry date." });

        var user = await _db.Users.FindAsync(request.AuthorizedByUserId);
        if (user == null) return BadRequest(new { error = "Authorizing user not found." });

        var today = DateTime.UtcNow.Date;
        
        int? prevDays = null;
        if (lot.ExpiryDate.HasValue)
        {
            prevDays = (int)(lot.ExpiryDate.Value.Date - today).TotalDays;
        }

        var newDays = (int)(request.NewExpiryDate.Date - today).TotalDays;
        var extDays = (int)(request.NewExpiryDate.Date - (lot.ExpiryDate?.Date ?? today)).TotalDays;

        var extension = new ShelfLifeExtension
        {
            Id = Guid.NewGuid(),
            InventoryLotId = lot.Id,
            ExtensionNumber = lot.ExtensionCount + 1,
            PreviousExpiryDate = lot.ExpiryDate,
            NewExpiryDate = request.NewExpiryDate,
            PreviousDaysToExpiry = prevDays,
            NewDaysToExpiry = newDays,
            ExtensionDays = extDays,
            Reason = request.Reason ?? string.Empty,
            TestPerformed = request.TestPerformed ?? string.Empty,
            TestResult = request.TestResult ?? string.Empty,
            TestDate = request.TestDate ?? DateTime.UtcNow,
            AuthorizedByUserId = request.AuthorizedByUserId,
            CreatedAt = DateTime.UtcNow
        };

        _db.ShelfLifeExtensions.Add(extension);

        // Update lot
        var oldExpiry = lot.ExpiryDate;
        lot.ExpiryDate = request.NewExpiryDate;
        lot.ExtensionCount += 1;
        lot.UpdatedAt = DateTime.UtcNow;

        if (lot.Status == "expired")
        {
            lot.Status = "active";
        }

        var metadata = new
        {
            lot_id = lot.Id,
            lot_number = lot.LotNumber,
            chemical_name = lot.Item.ItemName,
            previous_expiry_date = oldExpiry,
            new_expiry_date = request.NewExpiryDate,
            extension_number = lot.ExtensionCount,
            reason = extension.Reason,
            test_performed = extension.TestPerformed,
            test_result = extension.TestResult,
            authorized_by = user.FullName
        };

        var txn = new StockTransaction
        {
            Id = Guid.NewGuid(),
            TransactionType = "EXTEND_SHELF_LIFE",
            UserId = request.AuthorizedByUserId,
            UserName = user.FullName,
            LabId = lot.LabId,
            LocationId = lot.LocationId,
            LotId = lot.Id,
            ItemId = lot.ItemId,
            Quantity = lot.QuantityRemaining,
            CreatedAt = DateTime.UtcNow,
            Notes = $"Shelf life extended by {extDays} days. Reason: {extension.Reason}",
            Metadata = JsonSerializer.Serialize(metadata)
        };

        _db.StockTransactions.Add(txn);

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Shelf life extended successfully.",
            lotId = lot.Id,
            newExpiryDate = lot.ExpiryDate,
            status = lot.Status,
            extensionNumber = lot.ExtensionCount
        });
    }
}

public class ExtendShelfLifeRequest
{
    public Guid InventoryLotId { get; set; }
    public DateTime NewExpiryDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string TestPerformed { get; set; } = string.Empty;
    public string TestResult { get; set; } = string.Empty;
    public DateTime? TestDate { get; set; }
    public Guid AuthorizedByUserId { get; set; }
}
