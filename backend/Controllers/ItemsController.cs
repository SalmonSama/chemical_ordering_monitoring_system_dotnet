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
            .Select(i => new
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
            })
            .ToListAsync();
        return Ok(items);
    }
}
