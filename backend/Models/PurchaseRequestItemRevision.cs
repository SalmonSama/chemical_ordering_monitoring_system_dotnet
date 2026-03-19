namespace ChemWatch.Models;

public class PurchaseRequestItemRevision
{
    public Guid Id { get; set; }
    public Guid? PurchaseRequestItemId { get; set; }
    public Guid PurchaseRequestId { get; set; }
    public string Action { get; set; } = string.Empty;   // modified, added, removed
    public string? FieldName { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public Guid RevisedBy { get; set; }
    public DateTime RevisedAt { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }

    // Navigation
    public PurchaseRequestItem? PurchaseRequestItem { get; set; }
    public PurchaseRequest PurchaseRequest { get; set; } = null!;
    public User RevisedByUser { get; set; } = null!;
}
