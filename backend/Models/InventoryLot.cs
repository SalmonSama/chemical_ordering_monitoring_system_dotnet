namespace ChemWatch.Models;

public class InventoryLot
{
    public Guid Id { get; set; }
    public Guid ItemId { get; set; }
    public Guid LabId { get; set; }
    public Guid LocationId { get; set; }
    public Guid? VendorId { get; set; }
    public string LotNumber { get; set; } = string.Empty;
    public decimal QuantityReceived { get; set; }
    public decimal QuantityRemaining { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime? ManufactureDate { get; set; }
    public DateTime? OpenDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    
    // Peroxide Tracking fields
    public DateTime? FirstInspectDate { get; set; }
    public DateTime? LastMonitorDate { get; set; }
    public DateTime? NextMonitorDate { get; set; }
    public string? PeroxideStatus { get; set; } // Normal, Warning, Quarantine
    public string? StorageSublocation { get; set; }
    public string Status { get; set; } = "active";
    public string SourceType { get; set; } = "manual";

    // PO-related — nullable for manual check-in (Phase 3: always null)
    public Guid? PurchaseRequestId { get; set; }
    public Guid? PurchaseRequestItemId { get; set; }

    public Guid CheckedInBy { get; set; }
    public DateTime CheckedInAt { get; set; } = DateTime.UtcNow;

    // QR / Label — future phase
    public string? QrCodeData { get; set; }

    public int ExtensionCount { get; set; } = 0;
    public int Version { get; set; } = 1;
    public string? Notes { get; set; }

    // Manual check-in specific
    public string? ManualSourceReason { get; set; }

    // Verify STD specific — future phase data capture
    public string? CertificateOfAnalysis { get; set; }
    public string? AssignedValue { get; set; }
    public string? Uncertainty { get; set; }
    public string? CertifyingBody { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public Item Item { get; set; } = null!;
    public Lab Lab { get; set; } = null!;
    public Location Location { get; set; } = null!;
    public Vendor? Vendor { get; set; }
    public User CheckedInByUser { get; set; } = null!;
    public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    public ICollection<PeroxideTest> PeroxideTests { get; set; } = new List<PeroxideTest>();
    public ICollection<ShelfLifeExtension> ShelfLifeExtensions { get; set; } = new List<ShelfLifeExtension>();
}
