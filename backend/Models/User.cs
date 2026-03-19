namespace ChemWatch.Models;

public class User
{
    public Guid Id { get; set; }
    public string? ExternalId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public Guid RoleId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public Role Role { get; set; } = null!;
    public ICollection<UserLab> UserLabs { get; set; } = new List<UserLab>();
    public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    public ICollection<PurchaseRequest> PurchaseRequests { get; set; } = new List<PurchaseRequest>();
    public ICollection<PurchaseRequest> ApprovedPurchaseRequests { get; set; } = new List<PurchaseRequest>();
}
