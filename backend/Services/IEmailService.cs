namespace ChemWatch.Services;

using ChemWatch.Models;

public interface IEmailService
{
    Task SendVendorOrderEmailAsync(string vendorEmail, string vendorName, string poNumber, List<PurchaseRequestItem> items);
}
