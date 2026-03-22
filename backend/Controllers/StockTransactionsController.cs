using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StockTransactionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public StockTransactionsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StockTransaction>>> GetAll()
    {
        var txns = await _db.StockTransactions
            .Include(st => st.User)
            .Include(st => st.Lab)
            .Include(st => st.Location)
            .Include(st => st.InventoryLot)
            .Include(st => st.Item)
            .OrderByDescending(st => st.CreatedAt)
            .ToListAsync();
        return Ok(txns);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StockTransaction>> GetById(Guid id)
    {
        var txn = await _db.StockTransactions
            .Include(st => st.User)
            .Include(st => st.Lab)
            .Include(st => st.Location)
            .Include(st => st.InventoryLot)
            .Include(st => st.Item)
            .FirstOrDefaultAsync(st => st.Id == id);

        if (txn == null) return NotFound();
        return Ok(txn);
    }
}
