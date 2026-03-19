namespace ChemWatch.Models;

public class PurchaseRequest
{
    public Guid Id { get; set; }
    public string PoNumber { get; set; } = string.Empty;
    public Guid LabId { get; set; }
    public Guid LocationId { get; set; }
    public Guid RequestedBy { get; set; }
    public string Status { get; set; } = "pending_approval";
    public string? OrderNotes { get; set; }
    public string? ApprovalNotes { get; set; }
    public Guid? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? RejectedReason { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public Guid? LastModifiedBy { get; set; }
    public DateTime? LastModifiedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Lab Lab { get; set; } = null!;
    public Location Location { get; set; } = null!;
    public User Requester { get; set; } = null!;
    public User? Approver { get; set; }
    public ICollection<PurchaseRequestItem> Items { get; set; } = new List<PurchaseRequestItem>();
    public ICollection<PurchaseRequestItemRevision> Revisions { get; set; } = new List<PurchaseRequestItemRevision>();
}
