using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ItemsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ItemsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var items = await _db.Items
            .Include(i => i.Category)
            .Include(i => i.DefaultVendor)
            .Where(i => i.IsActive)
            .OrderBy(i => i.ItemName)
            .ToListAsync();
        return Ok(items.Select(FormatItem));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateItemRequest req)
    {
        // Admin-only
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (role != "admin")
            return Forbid();

        if (string.IsNullOrWhiteSpace(req.ItemName))
            return BadRequest(new { error = "Item name is required." });
        if (string.IsNullOrWhiteSpace(req.Unit))
            return BadRequest(new { error = "Unit is required." });
        if (string.IsNullOrWhiteSpace(req.CategoryId))
            return BadRequest(new { error = "Category is required." });

        var categoryId = Guid.Parse(req.CategoryId);
        var categoryExists = await _db.ItemCategories.AnyAsync(c => c.Id == categoryId);
        if (!categoryExists)
            return BadRequest(new { error = "Invalid category." });

        Guid? vendorId = null;
        if (!string.IsNullOrWhiteSpace(req.DefaultVendorId))
        {
            vendorId = Guid.Parse(req.DefaultVendorId);
            var vendorExists = await _db.Vendors.AnyAsync(v => v.Id == vendorId);
            if (!vendorExists)
                return BadRequest(new { error = "Invalid vendor." });
        }

        var item = new Item
        {
            Id = Guid.NewGuid(),
            ItemName = req.ItemName.Trim(),
            ItemShortName = req.ItemShortName?.Trim(),
            PartNo = req.PartNo?.Trim(),
            CasNo = req.CasNo?.Trim(),
            CategoryId = categoryId,
            DefaultVendorId = vendorId,
            Type = req.Type?.Trim(),
            Size = req.Size?.Trim(),
            Unit = req.Unit.Trim(),
            ReferencePrice = req.ReferencePrice,
            Currency = req.Currency?.Trim(),
            LeadTimeDays = req.LeadTimeDays,
            Description = req.Description?.Trim(),
            StorageConditions = req.StorageConditions?.Trim(),
            IsOrderable = req.IsOrderable ?? true,
            RequiresCheckin = req.RequiresCheckin ?? true,
            AllowsCheckout = req.AllowsCheckout ?? true,
            TracksExpiry = req.TracksExpiry ?? true,
            RequiresPeroxideMonitoring = req.RequiresPeroxideMonitoring ?? false,
            PeroxideClass = req.PeroxideClass?.Trim(),
            IsRegulatoryRelated = req.IsRegulatoryRelated ?? false,
            IsActive = req.IsActive ?? true,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Items.Add(item);
        await _db.SaveChangesAsync();

        // Reload with nav props
        var created = await _db.Items
            .Include(i => i.Category)
            .Include(i => i.DefaultVendor)
            .FirstAsync(i => i.Id == item.Id);

        return StatusCode(201, FormatItem(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] CreateItemRequest req)
    {
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (role != "admin")
            return Forbid();

        var item = await _db.Items
            .Include(i => i.Category)
            .Include(i => i.DefaultVendor)
            .FirstOrDefaultAsync(i => i.Id == id);
        if (item == null)
            return NotFound(new { error = "Item not found." });

        if (string.IsNullOrWhiteSpace(req.ItemName))
            return BadRequest(new { error = "Item name is required." });
        if (string.IsNullOrWhiteSpace(req.Unit))
            return BadRequest(new { error = "Unit is required." });
        if (string.IsNullOrWhiteSpace(req.CategoryId))
            return BadRequest(new { error = "Category is required." });

        var categoryId = Guid.Parse(req.CategoryId);
        var categoryExists = await _db.ItemCategories.AnyAsync(c => c.Id == categoryId);
        if (!categoryExists)
            return BadRequest(new { error = "Invalid category." });

        Guid? vendorId = null;
        if (!string.IsNullOrWhiteSpace(req.DefaultVendorId))
        {
            vendorId = Guid.Parse(req.DefaultVendorId);
            var vendorExists = await _db.Vendors.AnyAsync(v => v.Id == vendorId);
            if (!vendorExists)
                return BadRequest(new { error = "Invalid vendor." });
        }

        item.ItemName = req.ItemName.Trim();
        item.ItemShortName = req.ItemShortName?.Trim();
        item.PartNo = req.PartNo?.Trim();
        item.CasNo = req.CasNo?.Trim();
        item.CategoryId = categoryId;
        item.DefaultVendorId = vendorId;
        item.Type = req.Type?.Trim();
        item.Size = req.Size?.Trim();
        item.Unit = req.Unit.Trim();
        item.ReferencePrice = req.ReferencePrice;
        item.Currency = req.Currency?.Trim();
        item.LeadTimeDays = req.LeadTimeDays;
        item.Description = req.Description?.Trim();
        item.StorageConditions = req.StorageConditions?.Trim();
        item.IsOrderable = req.IsOrderable ?? item.IsOrderable;
        item.RequiresCheckin = req.RequiresCheckin ?? item.RequiresCheckin;
        item.AllowsCheckout = req.AllowsCheckout ?? item.AllowsCheckout;
        item.TracksExpiry = req.TracksExpiry ?? item.TracksExpiry;
        item.RequiresPeroxideMonitoring = req.RequiresPeroxideMonitoring ?? item.RequiresPeroxideMonitoring;
        item.PeroxideClass = req.PeroxideClass?.Trim();
        item.IsRegulatoryRelated = req.IsRegulatoryRelated ?? item.IsRegulatoryRelated;
        item.IsActive = req.IsActive ?? item.IsActive;
        item.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        // Reload nav props
        await _db.Entry(item).Reference(i => i.Category).LoadAsync();
        await _db.Entry(item).Reference(i => i.DefaultVendor).LoadAsync();

        return Ok(FormatItem(item));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (role != "admin")
            return Forbid();

        var item = await _db.Items.FirstOrDefaultAsync(i => i.Id == id);
        if (item == null)
            return NotFound(new { error = "Item not found." });

        if (!item.IsActive)
            return BadRequest(new { error = "Item is already inactive." });

        // Soft-delete: items may be referenced by inventory lots, orders, lab settings
        item.IsActive = false;
        item.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Item deactivated successfully." });
    }

    // ── Shared formatter ──────────────────────────────────────
    private static object FormatItem(Item i) => new
    {
        i.Id,
        i.ItemName,
        i.ItemShortName,
        i.PartNo,
        i.CasNo,
        i.CategoryId,
        i.DefaultVendorId,
        i.Type,
        i.Size,
        i.Unit,
        i.ReferencePrice,
        i.Currency,
        i.LeadTimeDays,
        i.Description,
        i.StorageConditions,
        i.IsOrderable,
        i.RequiresCheckin,
        i.AllowsCheckout,
        i.TracksExpiry,
        i.RequiresPeroxideMonitoring,
        i.PeroxideClass,
        i.IsRegulatoryRelated,
        i.IsActive,
        i.CreatedAt,
        i.UpdatedAt,
        Category = i.Category == null ? null : new
        {
            i.Category.Id,
            i.Category.Name,
            i.Category.Code,
            i.Category.Description,
            i.Category.DisplayOrder,
            i.Category.IsActive
        },
        DefaultVendor = i.DefaultVendor == null ? null : new
        {
            i.DefaultVendor.Id,
            i.DefaultVendor.Name,
            i.DefaultVendor.Code
        }
    };
}

// ── DTO ──────────────────────────────────────────────────────────
public record CreateItemRequest
{
    public string ItemName { get; init; } = string.Empty;
    public string? ItemShortName { get; init; }
    public string? PartNo { get; init; }
    public string? CasNo { get; init; }
    public string CategoryId { get; init; } = string.Empty;
    public string? DefaultVendorId { get; init; }
    public string? Type { get; init; }
    public string? Size { get; init; }
    public string Unit { get; init; } = string.Empty;
    public decimal? ReferencePrice { get; init; }
    public string? Currency { get; init; }
    public int? LeadTimeDays { get; init; }
    public string? Description { get; init; }
    public string? StorageConditions { get; init; }
    public bool? IsOrderable { get; init; }
    public bool? RequiresCheckin { get; init; }
    public bool? AllowsCheckout { get; init; }
    public bool? TracksExpiry { get; init; }
    public bool? RequiresPeroxideMonitoring { get; init; }
    public string? PeroxideClass { get; init; }
    public bool? IsRegulatoryRelated { get; init; }
    public bool? IsActive { get; init; }
}

