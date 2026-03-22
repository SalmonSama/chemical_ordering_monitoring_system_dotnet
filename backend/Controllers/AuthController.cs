using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ChemWatch.Data;
using ChemWatch.Models;
using ChemWatch.Models.DTOs;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    /// <summary>
    /// POST /api/auth/login — Authenticate with email + password, receive JWT.
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        var user = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.UserLocations)
                .ThenInclude(ul => ul.Location)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

        if (user == null)
            return Unauthorized(new { message = "Invalid email or password." });

        if (!user.IsActive)
            return Unauthorized(new { message = "Your account has been deactivated. Please contact your administrator." });

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        // Generate JWT
        var token = GenerateJwtToken(user);

        return Ok(new LoginResponse
        {
            Token = token,
            User = MapToUserResponse(user)
        });
    }

    /// <summary>
    /// POST /api/auth/forgot-password — MVP: returns "contact admin" message.
    /// </summary>
    [HttpPost("forgot-password")]
    public ActionResult ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        // MVP behavior per plan doc 04: "User submits their email.
        // System shows a message: Please contact your system administrator to reset your password."
        return Ok(new { message = "Please contact your system administrator to reset your password." });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? "ChemWatch-Default-Dev-Secret-Key-Min-32-Characters!";
        var issuer = jwtSettings["Issuer"] ?? "ChemWatch";
        var audience = jwtSettings["Audience"] ?? "ChemWatch";
        var expirationHours = int.Parse(jwtSettings["ExpirationHours"] ?? "8");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Role, user.Role.Name),
            new("location_scope_type", user.LocationScopeType)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expirationHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
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

// Simple DTO for forgot-password endpoint
namespace ChemWatch.Models.DTOs
{
    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}
