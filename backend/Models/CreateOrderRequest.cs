namespace ChemWatch.Models;

public class CreateOrderRequest
{
    public Guid LabId { get; set; }
    public Guid LocationId { get; set; }
    public Guid RequestedBy { get; set; }
    public string? OrderNotes { get; set; }
    public List<CreateOrderItemRequest> Items { get; set; } = new();
}

public class CreateOrderItemRequest
{
    public Guid ItemId { get; set; }
    public Guid? VendorId { get; set; }
    public decimal Quantity { get; set; }
    public string? Note { get; set; }
}
