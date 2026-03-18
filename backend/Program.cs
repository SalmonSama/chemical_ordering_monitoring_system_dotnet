using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;

var builder = WebApplication.CreateBuilder(args);

// ── Services ─────────────────────────────────────────────────────────

builder.Services.AddControllers();

// EF Core with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS – allow the Vite React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ── Middleware Pipeline ──────────────────────────────────────────────

app.UseCors("AllowFrontendDev");

app.UseAuthorization();

app.MapControllers();

app.Run();
