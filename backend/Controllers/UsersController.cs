using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;
using ChemWatch.Models.DTOs;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db) => _db = db;

    /// <summary>
    /// GET /api/users — List all users with role and location assignments.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAll()
    {
        var users = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.UserLocations)
                .ThenInclude(ul => ul.Location)
            .OrderBy(u => u.FullName)
            .ToListAsync();

        return Ok(users.Select(MapToUserResponse));
    }

    /// <summary>
    /// GET /api/users/{id} — Get a single user by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<UserResponse>> GetById(Guid id)
    {
        var user = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.UserLocations)
                .ThenInclude(ul => ul.Location)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        return Ok(MapToUserResponse(user));
    }

    /// <summary>
    /// POST /api/users — Create a new user (admin only).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<UserResponse>> Create([FromBody] CreateUserRequest request)
    {
        // Validate email uniqueness
        if (await _db.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
            return Conflict(new { message = "A user with this email already exists." });

        // Validate role exists
        var role = await _db.Roles.FindAsync(request.RoleId);
        if (role == null)
            return BadRequest(new { message = "Invalid role." });

        // Enforce: Admin users always have 'all' scope
        var scopeType = request.LocationScopeType?.ToLower() ?? "specific";
        if (role.Name == "admin")
            scopeType = "all";

        // Validate: if specific scope, must have at least one location
        if (scopeType == "specific" && (request.LocationIds == null || request.LocationIds.Count == 0))
            return BadRequest(new { message = "Users with specific location scope must have at least one assigned location." });

        // Validate password not empty
        if (string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Password is required." });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email.Trim(),
            FullName = request.FullName.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            RoleId = request.RoleId,
            LocationScopeType = scopeType,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);

        // Add location assignments if specific scope
        if (scopeType == "specific" && request.LocationIds != null)
        {
            foreach (var locationId in request.LocationIds)
            {
                _db.UserLocations.Add(new UserLocation
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    LocationId = locationId,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _db.SaveChangesAsync();

        // Reload with navigations
        var created = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.UserLocations)
                .ThenInclude(ul => ul.Location)
            .FirstAsync(u => u.Id == user.Id);

        return CreatedAtAction(nameof(GetById), new { id = user.Id }, MapToUserResponse(created));
    }

    /// <summary>
    /// PUT /api/users/{id} — Update user role, scope, locations, and status (admin only).
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<UserResponse>> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        var user = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.UserLocations)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        // Validate email
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required." });

        var normalizedEmail = request.Email.Trim().ToLower();
        if (await _db.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail && u.Id != id))
            return Conflict(new { message = "A user with this email already exists." });

        // Validate role exists
        var role = await _db.Roles.FindAsync(request.RoleId);
        if (role == null)
            return BadRequest(new { message = "Invalid role." });

        // Enforce: Admin users always have 'all' scope
        var scopeType = request.LocationScopeType?.ToLower() ?? "specific";
        if (role.Name == "admin")
            scopeType = "all";

        // Validate: if specific scope, must have at least one location
        if (scopeType == "specific" && (request.LocationIds == null || request.LocationIds.Count == 0))
            return BadRequest(new { message = "Users with specific location scope must have at least one assigned location." });

        // Update fields
        user.Email = request.Email.Trim();
        user.FullName = request.FullName.Trim();
        user.RoleId = request.RoleId;
        user.LocationScopeType = scopeType;
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        // Replace location assignments
        _db.UserLocations.RemoveRange(user.UserLocations);

        if (scopeType == "specific" && request.LocationIds != null)
        {
            foreach (var locationId in request.LocationIds)
            {
                _db.UserLocations.Add(new UserLocation
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    LocationId = locationId,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _db.SaveChangesAsync();

        // Reload with navigations
        var updated = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.UserLocations)
                .ThenInclude(ul => ul.Location)
            .FirstAsync(u => u.Id == user.Id);

        return Ok(MapToUserResponse(updated));
    }

    /// <summary>
    /// PUT /api/users/{id}/reset-password — Reset a user's password (admin only).
    /// </summary>
    [HttpPut("{id:guid}/reset-password")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> ResetPassword(Guid id, [FromBody] ResetPasswordRequest request)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        if (string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { message = "New password is required." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Password has been reset successfully." });
    }

    private static UserResponse MapToUserResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            RoleId = user.RoleId,
            RoleName = user.Role.Name,
            RoleDisplayName = user.Role.DisplayName,
            LocationScopeType = user.LocationScopeType,
            IsActive = user.IsActive,
            LastLoginAt = user.LastLoginAt,
            CreatedAt = user.CreatedAt,
            Locations = user.UserLocations.Select(ul => new LocationInfo
            {
                Id = ul.Location.Id,
                Name = ul.Location.Name,
                Code = ul.Location.Code
            }).ToList()
        };
    }
}
