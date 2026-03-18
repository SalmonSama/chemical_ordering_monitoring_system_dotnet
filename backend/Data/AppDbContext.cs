using Microsoft.EntityFrameworkCore;
using ChemWatch.Models;

namespace ChemWatch.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Phase 1
    public DbSet<TestItem> TestItems => Set<TestItem>();

    // Phase 2 — Master Data
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Lab> Labs => Set<Lab>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserLab> UserLabs => Set<UserLab>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<ItemCategory> ItemCategories => Set<ItemCategory>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<ItemLabSetting> ItemLabSettings => Set<ItemLabSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Role ──────────────────────────────────────────────────────
        modelBuilder.Entity<Role>(e =>
        {
            e.HasIndex(r => r.Name).IsUnique();
            e.Property(r => r.Name).HasMaxLength(50);
            e.Property(r => r.DisplayName).HasMaxLength(100);
        });

        // ── Location ──────────────────────────────────────────────────
        modelBuilder.Entity<Location>(e =>
        {
            e.HasIndex(l => l.Code).IsUnique();
            e.Property(l => l.Name).HasMaxLength(100);
            e.Property(l => l.Code).HasMaxLength(10);
        });

        // ── Lab ───────────────────────────────────────────────────────
        modelBuilder.Entity<Lab>(e =>
        {
            e.HasIndex(l => new { l.LocationId, l.Name }).IsUnique();
            e.Property(l => l.Name).HasMaxLength(100);
            e.Property(l => l.Code).HasMaxLength(20);

            e.HasOne(l => l.Location)
             .WithMany(loc => loc.Labs)
             .HasForeignKey(l => l.LocationId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── User ──────────────────────────────────────────────────────
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(255);
            e.Property(u => u.FullName).HasMaxLength(200);
            e.Property(u => u.ExternalId).HasMaxLength(255);

            e.HasOne(u => u.Role)
             .WithMany(r => r.Users)
             .HasForeignKey(u => u.RoleId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── UserLab ───────────────────────────────────────────────────
        modelBuilder.Entity<UserLab>(e =>
        {
            e.HasIndex(ul => new { ul.UserId, ul.LabId }).IsUnique();

            e.HasOne(ul => ul.User)
             .WithMany(u => u.UserLabs)
             .HasForeignKey(ul => ul.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(ul => ul.Lab)
             .WithMany(l => l.UserLabs)
             .HasForeignKey(ul => ul.LabId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Vendor ────────────────────────────────────────────────────
        modelBuilder.Entity<Vendor>(e =>
        {
            e.HasIndex(v => v.Name).IsUnique();
            e.Property(v => v.Name).HasMaxLength(200);
            e.Property(v => v.Code).HasMaxLength(20);
            e.Property(v => v.ContactEmail).HasMaxLength(255);
            e.Property(v => v.ContactPhone).HasMaxLength(50);
            e.Property(v => v.Website).HasMaxLength(500);
        });

        // ── ItemCategory ──────────────────────────────────────────────
        modelBuilder.Entity<ItemCategory>(e =>
        {
            e.HasIndex(ic => ic.Name).IsUnique();
            e.HasIndex(ic => ic.Code).IsUnique();
            e.Property(ic => ic.Name).HasMaxLength(100);
            e.Property(ic => ic.Code).HasMaxLength(20);
        });

        // ── Item ──────────────────────────────────────────────────────
        modelBuilder.Entity<Item>(e =>
        {
            e.Property(i => i.ItemName).HasMaxLength(300);
            e.Property(i => i.ItemShortName).HasMaxLength(100);
            e.Property(i => i.PartNo).HasMaxLength(100);
            e.Property(i => i.CasNo).HasMaxLength(50);
            e.Property(i => i.Type).HasMaxLength(50);
            e.Property(i => i.Size).HasMaxLength(50);
            e.Property(i => i.Unit).HasMaxLength(20);
            e.Property(i => i.ReferencePrice).HasColumnType("decimal(12,2)");
            e.Property(i => i.Currency).HasMaxLength(3);
            e.Property(i => i.StorageConditions).HasMaxLength(200);
            e.Property(i => i.PeroxideClass).HasMaxLength(10);

            e.HasOne(i => i.Category)
             .WithMany(c => c.Items)
             .HasForeignKey(i => i.CategoryId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(i => i.DefaultVendor)
             .WithMany(v => v.Items)
             .HasForeignKey(i => i.DefaultVendorId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── ItemLabSetting ────────────────────────────────────────────
        modelBuilder.Entity<ItemLabSetting>(e =>
        {
            e.HasIndex(ils => new { ils.ItemId, ils.LabId }).IsUnique();
            e.Property(ils => ils.MinStock).HasColumnType("decimal(12,3)");
            e.Property(ils => ils.ReorderQuantity).HasColumnType("decimal(12,3)");
            e.Property(ils => ils.StorageSublocation).HasMaxLength(100);

            e.HasOne(ils => ils.Item)
             .WithMany(i => i.ItemLabSettings)
             .HasForeignKey(ils => ils.ItemId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(ils => ils.Lab)
             .WithMany(l => l.ItemLabSettings)
             .HasForeignKey(ils => ils.LabId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Seed Data ─────────────────────────────────────────────────
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // ── Roles ─────────────────────────────────────────────────────
        var roleAdmin = new Role { Id = Guid.Parse("a0000000-0000-0000-0000-000000000001"), Name = "admin", DisplayName = "Admin", Description = "Full system access across all locations and labs", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var roleFocalPoint = new Role { Id = Guid.Parse("a0000000-0000-0000-0000-000000000002"), Name = "focal_point", DisplayName = "Focal Point / Lab Manager", Description = "Manages operations for assigned labs. Approves orders, monitors inventory.", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var roleLabUser = new Role { Id = Guid.Parse("a0000000-0000-0000-0000-000000000003"), Name = "lab_user", DisplayName = "Lab User", Description = "Day-to-day operational user. Creates orders, checks out chemicals.", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var roleViewer = new Role { Id = Guid.Parse("a0000000-0000-0000-0000-000000000004"), Name = "viewer", DisplayName = "Viewer / Auditor", Description = "Read-only access for compliance review and audit purposes.", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

        modelBuilder.Entity<Role>().HasData(roleAdmin, roleFocalPoint, roleLabUser, roleViewer);

        // ── Locations ─────────────────────────────────────────────────
        var locAIE = new Location { Id = Guid.Parse("b0000000-0000-0000-0000-000000000001"), Name = "AIE", Code = "AIE", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var locMTP = new Location { Id = Guid.Parse("b0000000-0000-0000-0000-000000000002"), Name = "MTP", Code = "MTP", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var locCT = new Location { Id = Guid.Parse("b0000000-0000-0000-0000-000000000003"), Name = "CT", Code = "CT", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var locATC = new Location { Id = Guid.Parse("b0000000-0000-0000-0000-000000000004"), Name = "ATC", Code = "ATC", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

        modelBuilder.Entity<Location>().HasData(locAIE, locMTP, locCT, locATC);

        // ── Labs (AIE) ────────────────────────────────────────────────
        var labPO = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000001"), LocationId = locAIE.Id, Name = "PO Lab", Code = "PO", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labEOU = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000002"), LocationId = locAIE.Id, Name = "EOU Lab", Code = "EOU", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labPG = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000003"), LocationId = locAIE.Id, Name = "PG Lab", Code = "PG", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labPOL = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000004"), LocationId = locAIE.Id, Name = "POL Lab", Code = "POL", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labSE = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000005"), LocationId = locAIE.Id, Name = "SE Lab", Code = "SE", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labAIEShared = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000006"), LocationId = locAIE.Id, Name = "Shared", Code = "AIE-SH", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

        // ── Labs (MTP) ────────────────────────────────────────────────
        var labEBSM = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000007"), LocationId = locMTP.Id, Name = "EBSM Lab", Code = "EBSM", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labPS = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000008"), LocationId = locMTP.Id, Name = "PS Lab", Code = "PS", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labLatex = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000009"), LocationId = locMTP.Id, Name = "Latex Lab", Code = "LATEX", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labPU = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-00000000000a"), LocationId = locMTP.Id, Name = "PU Lab", Code = "PU", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labFM = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-00000000000b"), LocationId = locMTP.Id, Name = "FM Lab", Code = "FM", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labEFF = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-00000000000c"), LocationId = locMTP.Id, Name = "EFF Lab", Code = "EFF", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labPE = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-00000000000d"), LocationId = locMTP.Id, Name = "PE Lab", Code = "PE", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labMTPShared = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-00000000000e"), LocationId = locMTP.Id, Name = "Shared", Code = "MTP-SH", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

        // ── Labs (CT, ATC) ────────────────────────────────────────────
        var labCT = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-00000000000f"), LocationId = locCT.Id, Name = "CT Lab", Code = "CT", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var labATC = new Lab { Id = Guid.Parse("c0000000-0000-0000-0000-000000000010"), LocationId = locATC.Id, Name = "ATC Lab", Code = "ATC", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

        modelBuilder.Entity<Lab>().HasData(
            labPO, labEOU, labPG, labPOL, labSE, labAIEShared,
            labEBSM, labPS, labLatex, labPU, labFM, labEFF, labPE, labMTPShared,
            labCT, labATC
        );

        // ── Item Categories ───────────────────────────────────────────
        var catChem = new ItemCategory { Id = Guid.Parse("d0000000-0000-0000-0000-000000000001"), Name = "Chemical & Reagent", Code = "CHEM", Description = "Laboratory chemicals, solvents, acids, bases, reagents", DisplayOrder = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var catGas = new ItemCategory { Id = Guid.Parse("d0000000-0000-0000-0000-000000000002"), Name = "Gas", Code = "GAS", Description = "Laboratory gases (nitrogen, argon, etc.)", DisplayOrder = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var catMat = new ItemCategory { Id = Guid.Parse("d0000000-0000-0000-0000-000000000003"), Name = "Material & Consumable", Code = "MAT", Description = "Lab consumables, filters, glassware, PPE", DisplayOrder = 3, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var catStd = new ItemCategory { Id = Guid.Parse("d0000000-0000-0000-0000-000000000004"), Name = "Verify STD", Code = "STD", Description = "Certified reference standards (USP, NIST, etc.)", DisplayOrder = 4, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

        modelBuilder.Entity<ItemCategory>().HasData(catChem, catGas, catMat, catStd);

        // ── Vendors (sample) ──────────────────────────────────────────
        var vendorSigma = new Vendor { Id = Guid.Parse("e0000000-0000-0000-0000-000000000001"), Name = "Sigma-Aldrich", Code = "SIGMA", ContactEmail = "orders@sigma.example.com", Website = "https://www.sigmaaldrich.com", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var vendorFisher = new Vendor { Id = Guid.Parse("e0000000-0000-0000-0000-000000000002"), Name = "Fisher Scientific", Code = "FISHER", ContactEmail = "orders@fisher.example.com", Website = "https://www.fishersci.com", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var vendorMerck = new Vendor { Id = Guid.Parse("e0000000-0000-0000-0000-000000000003"), Name = "Merck", Code = "MERCK", ContactEmail = "orders@merck.example.com", Website = "https://www.merck.com", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

        modelBuilder.Entity<Vendor>().HasData(vendorSigma, vendorFisher, vendorMerck);

        // ── Items (sample) ────────────────────────────────────────────
        // Chemical & Reagent — full lifecycle flags
        var itemAcetone = new Item
        {
            Id = Guid.Parse("f0000000-0000-0000-0000-000000000001"),
            ItemName = "Acetone", ItemShortName = "Acetone", PartNo = "179124", CasNo = "67-64-1",
            CategoryId = catChem.Id, DefaultVendorId = vendorSigma.Id,
            Type = "Solvent", Size = "2.5 L", Unit = "L", ReferencePrice = 45.00m, Currency = "USD",
            LeadTimeDays = 7, StorageConditions = "Flammable cabinet",
            IsOrderable = true, RequiresCheckin = true, AllowsCheckout = true, TracksExpiry = true,
            RequiresPeroxideMonitoring = false, IsRegulatoryRelated = false, IsActive = true,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        var itemTHF = new Item
        {
            Id = Guid.Parse("f0000000-0000-0000-0000-000000000002"),
            ItemName = "Tetrahydrofuran (THF)", ItemShortName = "THF", PartNo = "186562", CasNo = "109-99-9",
            CategoryId = catChem.Id, DefaultVendorId = vendorSigma.Id,
            Type = "Solvent", Size = "1 L", Unit = "L", ReferencePrice = 62.50m, Currency = "USD",
            LeadTimeDays = 10, StorageConditions = "Flammable cabinet, away from light",
            IsOrderable = true, RequiresCheckin = true, AllowsCheckout = true, TracksExpiry = true,
            RequiresPeroxideMonitoring = true, PeroxideClass = "B", IsRegulatoryRelated = true, IsActive = true,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        var itemHCl = new Item
        {
            Id = Guid.Parse("f0000000-0000-0000-0000-000000000003"),
            ItemName = "Hydrochloric Acid 37%", ItemShortName = "HCl 37%", PartNo = "320331", CasNo = "7647-01-0",
            CategoryId = catChem.Id, DefaultVendorId = vendorMerck.Id,
            Type = "Acid", Size = "500 mL", Unit = "mL", ReferencePrice = 35.00m, Currency = "USD",
            LeadTimeDays = 7, StorageConditions = "Corrosives cabinet",
            IsOrderable = true, RequiresCheckin = true, AllowsCheckout = true, TracksExpiry = true,
            RequiresPeroxideMonitoring = false, IsRegulatoryRelated = true, IsActive = true,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        // Gas — ordering only (MVP)
        var itemNitrogen = new Item
        {
            Id = Guid.Parse("f0000000-0000-0000-0000-000000000004"),
            ItemName = "Nitrogen Gas (N2)", ItemShortName = "N2", PartNo = "NI-UHP-K",
            CategoryId = catGas.Id, DefaultVendorId = vendorFisher.Id,
            Type = "Compressed Gas", Size = "K-size cylinder", Unit = "ea", ReferencePrice = 120.00m, Currency = "USD",
            LeadTimeDays = 3,
            IsOrderable = true, RequiresCheckin = false, AllowsCheckout = false, TracksExpiry = false,
            RequiresPeroxideMonitoring = false, IsRegulatoryRelated = false, IsActive = true,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        // Material & Consumable — selective ordering
        var itemGloves = new Item
        {
            Id = Guid.Parse("f0000000-0000-0000-0000-000000000005"),
            ItemName = "Nitrile Gloves (Medium)", ItemShortName = "Gloves M", PartNo = "NIT-M-100",
            CategoryId = catMat.Id, DefaultVendorId = vendorFisher.Id,
            Type = "PPE", Size = "Box of 100", Unit = "box", ReferencePrice = 18.00m, Currency = "USD",
            LeadTimeDays = 5,
            IsOrderable = true, RequiresCheckin = false, AllowsCheckout = false, TracksExpiry = false,
            RequiresPeroxideMonitoring = false, IsRegulatoryRelated = false, IsActive = true,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        // Verify STD — not ordered, manual check-in
        var itemUSPStd = new Item
        {
            Id = Guid.Parse("f0000000-0000-0000-0000-000000000006"),
            ItemName = "USP Acetaminophen Reference Standard", ItemShortName = "USP Acetaminophen", PartNo = "1003009",
            CategoryId = catStd.Id, DefaultVendorId = null,
            Type = "Reference Standard", Size = "200 mg", Unit = "mg",
            IsOrderable = false, RequiresCheckin = true, AllowsCheckout = true, TracksExpiry = true,
            RequiresPeroxideMonitoring = false, IsRegulatoryRelated = true, IsActive = true,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        modelBuilder.Entity<Item>().HasData(itemAcetone, itemTHF, itemHCl, itemNitrogen, itemGloves, itemUSPStd);

        // ── ItemLabSettings (sample) ──────────────────────────────────
        modelBuilder.Entity<ItemLabSetting>().HasData(
            new ItemLabSetting { Id = Guid.Parse("10000000-0000-0000-0000-000000000001"), ItemId = itemAcetone.Id, LabId = labPO.Id, MinStock = 3.0m, ReorderQuantity = 5.0m, IsStocked = true, StorageSublocation = "Cabinet A2", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new ItemLabSetting { Id = Guid.Parse("10000000-0000-0000-0000-000000000002"), ItemId = itemAcetone.Id, LabId = labEBSM.Id, MinStock = 2.0m, ReorderQuantity = 4.0m, IsStocked = true, StorageSublocation = "Shelf B1", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new ItemLabSetting { Id = Guid.Parse("10000000-0000-0000-0000-000000000003"), ItemId = itemTHF.Id, LabId = labPO.Id, MinStock = 2.0m, ReorderQuantity = 3.0m, IsStocked = true, StorageSublocation = "Flammable Cabinet 1", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new ItemLabSetting { Id = Guid.Parse("10000000-0000-0000-0000-000000000004"), ItemId = itemHCl.Id, LabId = labCT.Id, MinStock = 5.0m, ReorderQuantity = 10.0m, IsStocked = true, StorageSublocation = "Corrosives Cabinet", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
