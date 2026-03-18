namespace ChemWatch.Models;

public class ManualCheckInRequest
{
    public Guid ItemId { get; set; }
    public Guid LabId { get; set; }
    public Guid LocationId { get; set; }
    public Guid? VendorId { get; set; }
    public string LotNumber { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
    public DateTime? ManufactureDate { get; set; }
    public string? StorageSublocation { get; set; }
    public string? SourceReason { get; set; }
    public string? Notes { get; set; }
    public Guid PerformedByUserId { get; set; }
}
