using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAll()
    {
        var users = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.UserLabs)
                .ThenInclude(ul => ul.Lab)
            .Where(u => u.IsActive)
            .OrderBy(u => u.FullName)
            .ToListAsync();
        return Ok(users);
    }
}
