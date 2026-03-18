using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public LocationsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Location>>> GetAll()
    {
        var locations = await _db.Locations
            .Include(l => l.Labs.Where(lab => lab.IsActive))
            .Where(l => l.IsActive)
            .OrderBy(l => l.Code)
            .ToListAsync();
        return Ok(locations);
    }
}
