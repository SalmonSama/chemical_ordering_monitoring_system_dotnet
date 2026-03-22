using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using System.Text.Json;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly AppDbContext _db;

    public ReportController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/reports/transactions
    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactions([FromQuery] int limit = 100)
    {
        var txns = await _db.StockTransactions
            .Include(t => t.Lab)
            .Include(t => t.Location)
            .Include(t => t.Item)
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .ToListAsync();

        var result = txns.Select(t => {
            string lotNumber = "—";
            if (!string.IsNullOrEmpty(t.Metadata))
            {
                try {
                    using var doc = JsonDocument.Parse(t.Metadata);
                    if (doc.RootElement.TryGetProperty("lot_number", out var prop))
                    {
                        lotNumber = prop.GetString() ?? "—";
                    }
                } catch {}
            }

            return new {
                id = t.Id,
                timestamp = t.CreatedAt,
                type = t.TransactionType,
                itemName = t.Item?.ItemName ?? "Unknown Item",
                lotNumber = lotNumber,
                quantity = t.Quantity,
                userName = t.UserName,
                labName = t.Lab?.Name ?? "—",
                locationName = t.Location?.Name ?? "—",
                details = t.Notes ?? ""
            };
        });

        return Ok(result);
    }

    // GET: api/reports/regulatory
    [HttpGet("regulatory")]
    public async Task<IActionResult> GetRegulatoryReport()
    {
        // Items that are regulatory related
        var items = await _db.Items
            .Include(i => i.Category)
            .Where(i => i.IsRegulatoryRelated)
            .ToListAsync();

        var itemIds = items.Select(i => i.Id).ToList();

        // Aggregate quantities across active lots
        var lotAggregates = await _db.InventoryLots
            .Include(l => l.Lab)
            .Include(l => l.Location)
            .Where(l => l.Status == "active" && itemIds.Contains(l.ItemId))
            .GroupBy(l => new { l.ItemId, l.LabId, LabName = l.Lab.Name, LocationName = l.Location.Name })
            .Select(g => new {
                g.Key.ItemId,
                g.Key.LabName,
                g.Key.LocationName,
                TotalQuantity = g.Sum(l => l.QuantityRemaining),
                BottleCount = g.Count()
            })
            .ToListAsync();

        var result = new List<object>();

        foreach (var item in items)
        {
            var itemAggregates = lotAggregates.Where(a => a.ItemId == item.Id).ToList();
            if (itemAggregates.Count == 0)
            {
                // Include items with 0 stock
                result.Add(new {
                    itemCode = item.PartNo ?? "—",
                    category = item.Category.Name,
                    itemName = item.ItemName,
                    casNo = item.CasNo ?? "—",
                    labName = "—",
                    locationName = "—",
                    bottleCount = 0,
                    totalQuantity = 0,
                    unit = item.Unit
                });
            }
            else
            {
                foreach (var agg in itemAggregates)
                {
                    result.Add(new {
                        itemCode = item.PartNo ?? "—",
                        category = item.Category.Name,
                        itemName = item.ItemName,
                        casNo = item.CasNo ?? "—",
                        labName = agg.LabName,
                        locationName = agg.LocationName,
                        bottleCount = agg.BottleCount,
                        totalQuantity = agg.TotalQuantity,
                        unit = item.Unit
                    });
                }
            }
        }

        return Ok(result.OrderBy(r => ((dynamic)r).itemName));
    }
}
