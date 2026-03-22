namespace ChemWatch.Models;

public class StockTransaction
{
    public Guid Id { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid? LabId { get; set; }
    public Guid? LocationId { get; set; }
    public Guid? LotId { get; set; }
    public Guid? PurchaseRequestId { get; set; }
    public Guid? ItemId { get; set; }
    public decimal? Quantity { get; set; }
    public string? Notes { get; set; }
    public string Metadata { get; set; } = "{}";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // No UpdatedAt — this table is append-only

    // Navigation
    public User User { get; set; } = null!;
    public Lab? Lab { get; set; }
    public Location? Location { get; set; }
    public InventoryLot? InventoryLot { get; set; }
    public PurchaseRequest? PurchaseRequest { get; set; }
    public Item? Item { get; set; }
}
