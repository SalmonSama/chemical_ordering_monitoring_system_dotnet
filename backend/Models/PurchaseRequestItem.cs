namespace ChemWatch.Models;

public class PurchaseRequestItem
{
    public Guid Id { get; set; }
    public Guid PurchaseRequestId { get; set; }
    public Guid ItemId { get; set; }
    public Guid? VendorId { get; set; }
    public decimal QuantityOrdered { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal? UnitPrice { get; set; }
    public string? LineItemNotes { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public PurchaseRequest PurchaseRequest { get; set; } = null!;
    public Item Item { get; set; } = null!;
    public Vendor? Vendor { get; set; }
    public ICollection<PurchaseRequestItemRevision> Revisions { get; set; } = new List<PurchaseRequestItemRevision>();
}
