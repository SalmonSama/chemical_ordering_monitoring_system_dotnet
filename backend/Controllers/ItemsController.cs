using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ItemsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Item>>> GetAll()
    {
        var items = await _db.Items
            .Include(i => i.Category)
            .Include(i => i.DefaultVendor)
            .Where(i => i.IsActive)
            .OrderBy(i => i.ItemName)
            .ToListAsync();
        return Ok(items);
    }
}
