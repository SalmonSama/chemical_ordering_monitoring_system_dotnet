using System;

namespace ChemWatch.Models;

public class ShelfLifeExtension
{
    public Guid Id { get; set; }
    public Guid InventoryLotId { get; set; }
    public int ExtensionNumber { get; set; }
    public DateTime? PreviousExpiryDate { get; set; }
    public DateTime NewExpiryDate { get; set; }
    public int? PreviousDaysToExpiry { get; set; }
    public int NewDaysToExpiry { get; set; }
    public int ExtensionDays { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string TestPerformed { get; set; } = string.Empty;
    public string TestResult { get; set; } = string.Empty;
    public DateTime TestDate { get; set; }
    public Guid AuthorizedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public InventoryLot InventoryLot { get; set; } = null!;
    public User AuthorizedByUser { get; set; } = null!;
}
