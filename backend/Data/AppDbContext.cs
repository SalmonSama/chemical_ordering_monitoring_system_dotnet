using Microsoft.EntityFrameworkCore;
using ChemWatch.Models;

namespace ChemWatch.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TestItem> TestItems => Set<TestItem>();
}
