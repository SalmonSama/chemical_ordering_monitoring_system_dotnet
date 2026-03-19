namespace ChemWatch.Models;

public class ModifyOrderRequest
{
    public Guid ModifiedBy { get; set; }
    public string? Notes { get; set; }
    public List<ModifyOrderItemRequest> Items { get; set; } = new();
}

public class ModifyOrderItemRequest
{
    public Guid PurchaseRequestItemId { get; set; }
    public decimal? NewQuantity { get; set; }
    public Guid? NewVendorId { get; set; }
}
