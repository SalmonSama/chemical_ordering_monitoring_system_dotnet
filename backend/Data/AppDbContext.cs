using Microsoft.EntityFrameworkCore;
using ChemWatch.Models;

namespace ChemWatch.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Phase 1
    public DbSet<TestItem> TestItems => Set<TestItem>();

    // Master Data
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Lab> Labs => Set<Lab>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserLocation> UserLocations => Set<UserLocation>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<ItemCategory> ItemCategories => Set<ItemCategory>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<ItemLabSetting> ItemLabSettings => Set<ItemLabSetting>();
    public DbSet<PoReference> PoReferences => Set<PoReference>();
    public DbSet<PeroxideConfigRule> PeroxideConfigRules => Set<PeroxideConfigRule>();

    // Inventory Core
    public DbSet<InventoryLot> InventoryLots { get; set; }
    public DbSet<StockTransaction> StockTransactions { get; set; }

    // Order Workflow
    public DbSet<PurchaseRequest> PurchaseRequests { get; set; }
    public DbSet<PurchaseRequestItem> PurchaseRequestItems { get; set; }
    public DbSet<PurchaseRequestItemRevision> PurchaseRequestItemRevisions { get; set; }
    public DbSet<PeroxideTest> PeroxideTests { get; set; }
    public DbSet<ShelfLifeExtension> ShelfLifeExtensions { get; set; }

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
            e.Property(u => u.PasswordHash).HasMaxLength(255);
            e.Property(u => u.LocationScopeType).HasMaxLength(20);

            e.HasOne(u => u.Role)
             .WithMany(r => r.Users)
             .HasForeignKey(u => u.RoleId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── UserLocation ─────────────────────────────────────────────
        modelBuilder.Entity<UserLocation>(e =>
        {
            e.HasIndex(ul => new { ul.UserId, ul.LocationId }).IsUnique();

            e.HasOne(ul => ul.User)
             .WithMany(u => u.UserLocations)
             .HasForeignKey(ul => ul.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(ul => ul.Location)
             .WithMany()
             .HasForeignKey(ul => ul.LocationId)
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

        // ── PoReference ───────────────────────────────────────────────
        modelBuilder.Entity<PoReference>(e =>
        {
            e.HasIndex(p => p.PoNumber).IsUnique();
            e.Property(p => p.PoNumber).HasMaxLength(50);

            e.HasOne(p => p.Category)
             .WithMany()
             .HasForeignKey(p => p.CategoryId)
             .OnDelete(DeleteBehavior.SetNull);

            e.HasOne(p => p.Lab)
             .WithMany()
             .HasForeignKey(p => p.LabId)
             .OnDelete(DeleteBehavior.SetNull);

            e.HasOne(p => p.Vendor)
             .WithMany()
             .HasForeignKey(p => p.VendorId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── PeroxideConfigRule ────────────────────────────────────────
        modelBuilder.Entity<PeroxideConfigRule>(e =>
        {
            e.HasIndex(p => p.PeroxideClass).IsUnique();
            e.Property(p => p.PeroxideClass).HasMaxLength(20);
        });

        // ── InventoryLot ──────────────────────────────────────────────
        modelBuilder.Entity<InventoryLot>(e =>
        {
            e.HasIndex(il => il.LabId);
            e.HasIndex(il => il.ItemId);
            e.HasIndex(il => il.Status);
            e.HasIndex(il => il.ExpiryDate);
            e.HasIndex(il => new { il.ItemId, il.LabId });
            e.HasIndex(il => il.LotNumber);

            e.Property(il => il.LotNumber).HasMaxLength(100);
            e.Property(il => il.Unit).HasMaxLength(20);
            e.Property(il => il.QuantityReceived).HasColumnType("decimal(12,3)");
            e.Property(il => il.QuantityRemaining).HasColumnType("decimal(12,3)");
            e.Property(il => il.StorageSublocation).HasMaxLength(200);
            e.Property(il => il.Status).HasMaxLength(20);
            e.Property(il => il.SourceType).HasMaxLength(20);
            e.Property(il => il.ManualSourceReason).HasMaxLength(50);
            e.Property(il => il.CertificateOfAnalysis).HasMaxLength(200);
            e.Property(il => il.AssignedValue).HasMaxLength(100);
            e.Property(il => il.Uncertainty).HasMaxLength(100);
            e.Property(il => il.CertifyingBody).HasMaxLength(200);
            e.Property(il => il.QrCodeData).HasColumnType("jsonb");

            e.HasOne(il => il.Item)
             .WithMany(i => i.InventoryLots)
             .HasForeignKey(il => il.ItemId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(il => il.Lab)
             .WithMany(l => l.InventoryLots)
             .HasForeignKey(il => il.LabId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(il => il.Location)
             .WithMany()
             .HasForeignKey(il => il.LocationId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(il => il.Vendor)
             .WithMany(v => v.InventoryLots)
             .HasForeignKey(il => il.VendorId)
             .OnDelete(DeleteBehavior.SetNull);

            e.HasOne(il => il.CheckedInByUser)
             .WithMany()
             .HasForeignKey(il => il.CheckedInBy)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── StockTransaction ──────────────────────────────────────────
        modelBuilder.Entity<StockTransaction>(e =>
        {
            e.HasIndex(st => st.TransactionType);
            e.HasIndex(st => st.LabId);
            e.HasIndex(st => st.LotId);
            e.HasIndex(st => st.PurchaseRequestId);
            e.HasIndex(st => st.ItemId);
            e.HasIndex(st => st.CreatedAt);
            e.HasIndex(st => st.UserId);

            e.Property(st => st.TransactionType).HasMaxLength(30);
            e.Property(st => st.UserName).HasMaxLength(200);
            e.Property(st => st.Metadata).HasColumnType("jsonb");
            e.Property(st => st.Quantity).HasColumnType("decimal(12,3)");

            e.HasOne(st => st.User)
             .WithMany()
             .HasForeignKey(st => st.UserId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(st => st.Lab)
             .WithMany(l => l.StockTransactions)
             .HasForeignKey(st => st.LabId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(st => st.Location)
             .WithMany()
             .HasForeignKey(st => st.LocationId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(st => st.InventoryLot)
             .WithMany(il => il.StockTransactions)
             .HasForeignKey(st => st.LotId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(st => st.Item)
             .WithMany()
             .HasForeignKey(st => st.ItemId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(st => st.PurchaseRequest)
             .WithMany(pr => pr.StockTransactions)
             .HasForeignKey(st => st.PurchaseRequestId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── PurchaseRequest ──────────────────────────────────────────
        modelBuilder.Entity<PurchaseRequest>(e =>
        {
            e.HasIndex(pr => pr.PoNumber).IsUnique();
            e.HasIndex(pr => pr.LabId);
            e.HasIndex(pr => pr.Status);
            e.HasIndex(pr => pr.SubmittedAt);
            e.HasIndex(pr => pr.RequestedBy);

            e.Property(pr => pr.PoNumber).HasMaxLength(50);
            e.Property(pr => pr.Status).HasMaxLength(30);

            e.HasOne(pr => pr.Lab)
             .WithMany()
             .HasForeignKey(pr => pr.LabId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(pr => pr.Location)
             .WithMany()
             .HasForeignKey(pr => pr.LocationId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(pr => pr.RequestedByUser)
             .WithMany()
             .HasForeignKey(pr => pr.RequestedBy)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(pr => pr.ApprovedByUser)
             .WithMany()
             .HasForeignKey(pr => pr.ApprovedBy)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── PurchaseRequestItem ──────────────────────────────────────
        modelBuilder.Entity<PurchaseRequestItem>(e =>
        {
            e.HasIndex(pri => pri.PurchaseRequestId);
            e.HasIndex(pri => pri.ItemId);
            e.HasIndex(pri => pri.VendorId);

            e.Property(pri => pri.QuantityOrdered).HasColumnType("decimal(12,3)");
            e.Property(pri => pri.QuantityReceived).HasColumnType("decimal(12,3)");
            e.Property(pri => pri.UnitPrice).HasColumnType("decimal(12,2)");
            e.Property(pri => pri.Unit).HasMaxLength(20);
            e.Property(pri => pri.Status).HasMaxLength(30);

            e.HasOne(pri => pri.PurchaseRequest)
             .WithMany(pr => pr.Items)
             .HasForeignKey(pri => pri.PurchaseRequestId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(pri => pri.Item)
             .WithMany(i => i.PurchaseRequestItems)
             .HasForeignKey(pri => pri.ItemId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(pri => pri.Vendor)
             .WithMany(v => v.PurchaseRequestItems)
             .HasForeignKey(pri => pri.VendorId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── PurchaseRequestItemRevision ───────────────────────────────
        modelBuilder.Entity<PurchaseRequestItemRevision>(e =>
        {
            e.HasIndex(r => r.PurchaseRequestId);
            e.HasIndex(r => r.PurchaseRequestItemId);

            e.Property(r => r.Action).HasMaxLength(20);
            e.Property(r => r.FieldName).HasMaxLength(50);

            e.HasOne(r => r.PurchaseRequest)
             .WithMany(pr => pr.Revisions)
             .HasForeignKey(r => r.PurchaseRequestId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(r => r.PurchaseRequestItem)
             .WithMany(pri => pri.Revisions)
             .HasForeignKey(r => r.PurchaseRequestItemId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(r => r.RevisedByUser)
             .WithMany()
             .HasForeignKey(r => r.RevisedBy)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── PeroxideTest ──────────────────────────────────────────────
        modelBuilder.Entity<PeroxideTest>(e =>
        {
            e.HasIndex(pt => pt.InventoryLotId);
            e.HasIndex(pt => pt.TestedByUserId);
            e.HasIndex(pt => pt.TestDate);

            e.Property(pt => pt.ResultText).HasMaxLength(50);
            e.Property(pt => pt.Notes).HasMaxLength(500);

            e.HasOne(pt => pt.InventoryLot)
             .WithMany(il => il.PeroxideTests)
             .HasForeignKey(pt => pt.InventoryLotId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(pt => pt.TestedByUser)
             .WithMany()
             .HasForeignKey(pt => pt.TestedByUserId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── ShelfLifeExtension ────────────────────────────────────────
        modelBuilder.Entity<ShelfLifeExtension>(e =>
        {
            e.HasIndex(x => x.InventoryLotId);
            e.HasIndex(x => x.AuthorizedByUserId);

            e.Property(x => x.Reason).HasMaxLength(500);
            e.Property(x => x.TestPerformed).HasMaxLength(200);
            e.Property(x => x.TestResult).HasMaxLength(200);

            e.HasOne(x => x.InventoryLot)
             .WithMany(il => il.ShelfLifeExtensions)
             .HasForeignKey(x => x.InventoryLotId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.AuthorizedByUser)
             .WithMany()
             .HasForeignKey(x => x.AuthorizedByUserId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── Ignore deprecated UserLab (kept only for migration compatibility)
        modelBuilder.Ignore<UserLab>();

        // ── Seed Data ─────────────────────────────────────────────────
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // ── Roles (plan doc 20: admin, focal_point, user) ──────────────
        var roleAdmin = new Role { Id = Guid.Parse("a0000000-0000-0000-0000-000000000001"), Name = "admin", DisplayName = "Admin", Description = "Full system access across all locations and labs", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var roleFocalPoint = new Role { Id = Guid.Parse("a0000000-0000-0000-0000-000000000002"), Name = "focal_point", DisplayName = "Focal Point", Description = "Manages operations for assigned locations. Approves orders, manages inventory.", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
        var roleUser = new Role { Id = Guid.Parse("a0000000-0000-0000-0000-000000000003"), Name = "user", DisplayName = "User", Description = "Day-to-day operational user. Creates orders, checks out chemicals.", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) };

        modelBuilder.Entity<Role>().HasData(roleAdmin, roleFocalPoint, roleUser);

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

        // ── Users (seed admin with bcrypt password) ───────────────────
        // Password: Admin123!
        // Static pre-computed hash (bcrypt) — do NOT use dynamic HashPassword() in seed data
        // as it generates a different hash each build, breaking EF migration snapshots.
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = Guid.Parse("20000000-0000-0000-0000-000000000001"),
                Email = "admin@chemwatch.local",
                FullName = "System Admin",
                PasswordHash = "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG",
                RoleId = roleAdmin.Id,
                LocationScopeType = "all",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
