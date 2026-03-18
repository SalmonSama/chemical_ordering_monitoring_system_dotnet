namespace ChemWatch.Models;

public class ItemLabSetting
{
    public Guid Id { get; set; }
    public Guid ItemId { get; set; }
    public Guid LabId { get; set; }
    public decimal? MinStock { get; set; }
    public decimal? ReorderQuantity { get; set; }
    public bool IsStocked { get; set; } = false;
    public string? StorageSublocation { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public Item Item { get; set; } = null!;
    public Lab Lab { get; set; } = null!;
}
