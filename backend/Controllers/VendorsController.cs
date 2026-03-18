using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorsController : ControllerBase
{
    private readonly AppDbContext _db;

    public VendorsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vendor>>> GetAll()
    {
        var vendors = await _db.Vendors
            .Where(v => v.IsActive)
            .OrderBy(v => v.Name)
            .ToListAsync();
        return Ok(vendors);
    }
}
