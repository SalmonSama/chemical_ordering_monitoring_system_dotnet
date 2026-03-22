using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ItemLabSettingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ItemLabSettingsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemLabSetting>>> GetAll()
    {
        var settings = await _db.ItemLabSettings
            .Include(ils => ils.Item)
            .Include(ils => ils.Lab)
                .ThenInclude(l => l.Location)
            .OrderBy(ils => ils.Item.ItemName)
            .ThenBy(ils => ils.Lab.Location.Code)
            .ThenBy(ils => ils.Lab.Name)
            .ToListAsync();
        return Ok(settings);
    }
}
