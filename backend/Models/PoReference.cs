namespace ChemWatch.Models;

public class PoReference
{
    public Guid Id { get; set; }
    public string PoNumber { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public Guid? LabId { get; set; }
    public Guid? VendorId { get; set; }

    public ItemCategory? Category { get; set; }
    public Lab? Lab { get; set; }
    public Vendor? Vendor { get; set; }
}
