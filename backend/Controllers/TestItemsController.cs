using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestItemsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TestItemsController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Returns all test items from the database.
    /// Used to verify end-to-end connectivity (frontend → backend → PostgreSQL).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TestItem>>> GetAll()
    {
        var items = await _db.TestItems.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return Ok(items);
    }

    /// <summary>
    /// Creates a test item. Used for quick seeding during development.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TestItem>> Create([FromBody] CreateTestItemRequest request)
    {
        var item = new TestItem
        {
            Name = request.Name,
            CreatedAt = DateTime.UtcNow
        };

        _db.TestItems.Add(item);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
    }
}

public class CreateTestItemRequest
{
    public string Name { get; set; } = string.Empty;
}
