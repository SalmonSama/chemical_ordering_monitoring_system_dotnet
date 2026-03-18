namespace ChemWatch.Models;

public class Lab
{
    public Guid Id { get; set; }
    public Guid LocationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public Location Location { get; set; } = null!;
    public ICollection<UserLab> UserLabs { get; set; } = new List<UserLab>();
    public ICollection<ItemLabSetting> ItemLabSettings { get; set; } = new List<ItemLabSetting>();
    public ICollection<InventoryLot> InventoryLots { get; set; } = new List<InventoryLot>();
    public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
}
