using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;

    public DashboardController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/dashboard/order-status
    [HttpGet("order-status")]
    public async Task<IActionResult> GetOrderStatus()
    {
        var orders = await _db.PurchaseRequests
            .Include(pr => pr.RequestedByUser)
            .Include(pr => pr.Lab)
            .Include(pr => pr.Location)
            .Include(pr => pr.Items)
                .ThenInclude(li => li.Item)
                    .ThenInclude(i => i.Category)
            .Include(pr => pr.Items)
                .ThenInclude(li => li.Vendor)
            .OrderByDescending(pr => pr.SubmittedAt)
            .ToListAsync();

        var result = orders.Select(pr => {
            var items = pr.Items;
            var firstItem = items.FirstOrDefault();
            
            var categoryNames = items.Select(i => i.Item.Category.Name).Distinct().ToList();
            var category = categoryNames.Count == 1 ? categoryNames[0] : "Mixed";

            var vendorNames = items.Where(i => i.Vendor != null).Select(i => i.Vendor!.Name).Distinct().ToList();
            var vendor = vendorNames.Count == 1 ? vendorNames[0] : (vendorNames.Count > 1 ? "Multiple" : "None");

            var itemSummary = firstItem == null ? "Empty" :
                              (items.Count > 1 ? $"{firstItem.Item.ItemName} (+{items.Count - 1} more)" : firstItem.Item.ItemName);

            return new {
                id = pr.Id,
                poNumber = pr.PoNumber,
                status = pr.Status,
                category = category,
                itemSummary = itemSummary,
                totalQty = items.Sum(i => i.QuantityOrdered),
                vendor = vendor,
                labName = pr.Lab.Name,
                locationName = pr.Location.Name,
                requester = pr.RequestedByUser.FullName,
                entryDate = pr.SubmittedAt,
                approveDate = pr.ApprovedAt,
                lastUpdated = pr.UpdatedAt ?? pr.SubmittedAt
            };
        });

        return Ok(result);
    }

    // GET: api/dashboard/min-stock
    [HttpGet("min-stock")]
    public async Task<IActionResult> GetMinStock()
    {
        // Get settings
        var settings = await _db.ItemLabSettings
            .Include(s => s.Item)
                .ThenInclude(i => i.Category)
            .Include(s => s.Lab)
                .ThenInclude(l => l.Location)
            .Where(s => s.MinStock > 0)
            .ToListAsync();

        // Get active inventories
        var activeLots = await _db.InventoryLots
            .Where(l => l.Status == "active")
            .GroupBy(l => new { l.ItemId, l.LabId })
            .Select(g => new { 
                g.Key.ItemId, 
                g.Key.LabId, 
                TotalQuantity = g.Sum(x => x.QuantityRemaining) 
            })
            .ToDictionaryAsync(k => $"{k.ItemId}_{k.LabId}", v => v.TotalQuantity);

        var result = settings.Select(s => {
            var key = $"{s.ItemId}_{s.LabId}";
            var totalQty = activeLots.ContainsKey(key) ? activeLots[key] : 0;
            var deficit = (s.MinStock ?? 0) - totalQty;

            string condition = totalQty == 0 ? "out_of_stock" :
                               (totalQty < s.MinStock ? "below_min" : "adequate");

            return new {
                statusIndicator = condition,
                itemName = s.Item.ItemName,
                catalogNumber = s.Item.PartNo,
                category = s.Item.Category.Name,
                labName = s.Lab.Name,
                locationName = s.Lab.Location.Name,
                totalQuantity = totalQty,
                unit = s.Item.Unit,
                minStock = s.MinStock,
                deficit = deficit,
                longLeadTime = (s.Item.LeadTimeDays ?? 0) > 14 ? "Yes" : "No"
            };
        })
        .Where(x => x.statusIndicator != "adequate")
        .OrderByDescending(x => x.deficit)
        .ToList();

        return Ok(result);
    }

    // GET: api/dashboard/expired
    [HttpGet("expired")]
    public async Task<IActionResult> GetExpired()
    {
        var lots = await _db.InventoryLots
            .Include(l => l.Item)
                .ThenInclude(i => i.Category)
            .Include(l => l.Lab)
            .Include(l => l.Location)
            .Where(l => l.Status == "active" || l.Status == "expired")
            .Where(l => l.ExpiryDate.HasValue)
            .ToListAsync();

        var today = DateTime.UtcNow.Date;

        var result = lots.Select(l => {
            var exp = l.ExpiryDate!.Value.Date;
            var daysToExpiry = (int)(exp - today).TotalDays;

            string condition = daysToExpiry < 0 ? "expired" :
                               (daysToExpiry <= 90 ? "near_expire" : "active");

            return new {
                id = l.Id,
                statusIndicator = condition,
                itemName = l.Item.ItemName,
                lotNumber = l.LotNumber,
                category = l.Item.Category.Name,
                labName = l.Lab.Name,
                locationName = l.Location.Name,
                expiryDate = l.ExpiryDate,
                daysToExpiry = daysToExpiry,
                quantityRemaining = l.QuantityRemaining,
                unit = l.Unit,
                extensionCount = l.ExtensionCount,
                lastActionDate = l.UpdatedAt ?? l.CreatedAt
            };
        })
        .Where(x => x.statusIndicator != "active")
        .OrderBy(x => x.daysToExpiry)
        .ToList();

        return Ok(result);
    }

    // GET: api/dashboard/peroxide-due
    [HttpGet("peroxide-due")]
    public async Task<IActionResult> GetPeroxideDue()
    {
        var lots = await _db.InventoryLots
            .Include(l => l.Item)
            .Include(l => l.Lab)
            .Include(l => l.Location)
            .Where(l => l.Item.RequiresPeroxideMonitoring && (l.Status == "active" || l.Status == "quarantined"))
            .ToListAsync();

        var lotIds = lots.Select(l => l.Id).ToList();

        // Get the latest peroxide test per lot
        var latestTests = await _db.PeroxideTests
            .Where(pt => lotIds.Contains(pt.InventoryLotId))
            .GroupBy(pt => pt.InventoryLotId)
            .Select(g => g.OrderByDescending(pt => pt.CreatedAt).FirstOrDefault())
            .ToListAsync();

        var testDict = latestTests.Where(pt => pt != null).ToDictionary(pt => pt!.InventoryLotId, pt => pt);

        var today = DateTime.UtcNow.Date;

        var result = lots.Select(l => {
            var test = testDict.ContainsKey(l.Id) ? testDict[l.Id] : null;
            
            DateTime nextDate;
            if (test != null && test.NextMonitorDue.HasValue)
            {
                nextDate = test.NextMonitorDue.Value.Date;
            }
            else if (l.NextMonitorDate.HasValue)
            {
                nextDate = l.NextMonitorDate.Value.Date;
            }
            else
            {
                // Fallback: 6 months from open or check-in
                nextDate = (l.OpenDate ?? l.CheckedInAt).Date.AddMonths(6);
            }

            var monitorDueIn = (int)(nextDate - today).TotalDays;

            string condition = "normal";
            if (l.Status == "quarantined" || l.PeroxideStatus == "Quarantine" || (test != null && test.Classification == "Quarantine"))
            {
                condition = "quarantined";
            }
            else if (monitorDueIn < 0)
            {
                condition = "overdue";
            }
            else if (monitorDueIn <= 7)
            {
                condition = "due_soon";
            }
            else if (l.PeroxideStatus == "Warning" || (test != null && test.Classification == "Warning"))
            {
                condition = "warning";
            }

            return new {
                id = l.Id,
                statusIndicator = condition,
                itemName = l.Item.ItemName,
                lotNumber = l.LotNumber,
                labName = l.Lab.Name,
                locationName = l.Location.Name,
                monitorDueIn = monitorDueIn,
                monitorDate = nextDate,
                lastMonitorDate = test?.TestDate ?? l.LastMonitorDate,
                lastPpmResult = test != null ? (test.PpmResult.HasValue ? $"{test.PpmResult} ppm" : test.ResultText) : "—",
                lastClassification = test?.Classification ?? "—",
                openDate = l.OpenDate
            };
        })
        .OrderByDescending(x => x.statusIndicator == "quarantined" ? 1 : 0) // Quarantine first
        .ThenBy(x => x.monitorDueIn)
        .ToList();

        return Ok(result);
    }
}
