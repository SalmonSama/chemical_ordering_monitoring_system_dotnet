using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryLotsController : ControllerBase
{
    private readonly AppDbContext _db;

    public InventoryLotsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventoryLot>>> GetAll()
    {
        var lots = await _db.InventoryLots
            .Include(il => il.Item)
            .Include(il => il.Lab)
            .Include(il => il.Location)
            .Include(il => il.Vendor)
            .Include(il => il.CheckedInByUser)
            .OrderByDescending(il => il.CheckedInAt)
            .ToListAsync();
        return Ok(lots);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InventoryLot>> GetById(Guid id)
    {
        var lot = await _db.InventoryLots
            .Include(il => il.Item)
            .Include(il => il.Lab)
            .Include(il => il.Location)
            .Include(il => il.Vendor)
            .Include(il => il.CheckedInByUser)
            .FirstOrDefaultAsync(il => il.Id == id);

        if (lot == null) return NotFound();
        return Ok(lot);
    }
}
