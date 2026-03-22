using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LabsController : ControllerBase
{
    private readonly AppDbContext _db;

    public LabsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Lab>>> GetAll()
    {
        var labs = await _db.Labs
            .Include(l => l.Location)
            .Where(l => l.IsActive)
            .OrderBy(l => l.Location.Code)
            .ThenBy(l => l.Name)
            .ToListAsync();
        return Ok(labs);
    }
}
