namespace ChemWatch.Models;

public class Item
{
    public Guid Id { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string? ItemShortName { get; set; }
    public string? PartNo { get; set; }
    public string? CasNo { get; set; }
    public Guid CategoryId { get; set; }
    public Guid? DefaultVendorId { get; set; }
    public string? Type { get; set; }
    public string? Size { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal? ReferencePrice { get; set; }
    public string? Currency { get; set; }
    public int? LeadTimeDays { get; set; }
    public string? Description { get; set; }
    public string? StorageConditions { get; set; }

    // Behavior flags
    public bool IsOrderable { get; set; } = true;
    public bool RequiresCheckin { get; set; } = true;
    public bool AllowsCheckout { get; set; } = true;
    public bool TracksExpiry { get; set; } = true;
    public bool RequiresPeroxideMonitoring { get; set; } = false;
    public string? PeroxideClass { get; set; }
    public bool IsRegulatoryRelated { get; set; } = false;
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public ItemCategory Category { get; set; } = null!;
    public Vendor? DefaultVendor { get; set; }
    public ICollection<ItemLabSetting> ItemLabSettings { get; set; } = new List<ItemLabSetting>();
    public ICollection<InventoryLot> InventoryLots { get; set; } = new List<InventoryLot>();
}
