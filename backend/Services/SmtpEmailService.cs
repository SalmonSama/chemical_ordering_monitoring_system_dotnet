using System.Net;
using System.Net.Mail;
using System.Text;
using ChemWatch.Models;

namespace ChemWatch.Services;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IConfiguration config, ILogger<SmtpEmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendVendorOrderEmailAsync(string vendorEmail, string vendorName, string poNumber, List<PurchaseRequestItem> items)
    {
        var host = _config["SmtpSettings:Host"];
        var portStr = _config["SmtpSettings:Port"];
        var username = _config["SmtpSettings:Username"];
        var password = _config["SmtpSettings:Password"];
        var fromEmail = _config["SmtpSettings:FromEmail"] ?? "noreply@chemwatch.local";

        var subject = $"New Purchase Order: {poNumber}";
        
        var bodyBuilder = new StringBuilder();
        bodyBuilder.AppendLine($"Hello {vendorName},");
        bodyBuilder.AppendLine();
        bodyBuilder.AppendLine($"Please process the following order {poNumber}:");
        bodyBuilder.AppendLine();
        bodyBuilder.AppendLine("Items:");
        
        foreach (var item in items)
        {
            var itemName = item.Item?.ItemName ?? "Unknown Item";
            bodyBuilder.AppendLine($"- {itemName}: {item.QuantityOrdered} {item.Unit}");
        }
        
        bodyBuilder.AppendLine();
        bodyBuilder.AppendLine("Thank you,");
        bodyBuilder.AppendLine("ChemWatch System");

        var body = bodyBuilder.ToString();

        if (string.IsNullOrWhiteSpace(host))
        {
            // Fallback for development/testing when SMTP is not configured
            _logger.LogInformation("\n========== EMAIL INTERCEPTED (NO SMTP CONFIGURED) ==========");
            _logger.LogInformation("To: {Email}", vendorEmail);
            _logger.LogInformation("Subject: {Subject}", subject);
            _logger.LogInformation("Body:\n{Body}", body);
            _logger.LogInformation("============================================================\n");
            return;
        }

        try
        {
            int.TryParse(portStr, out int port);
            if (port == 0) port = 587;

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage(
                from: fromEmail,
                to: vendorEmail,
                subject: subject,
                body: body
            );

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Email sent successfully to {Email} for PO {PO}", vendorEmail, poNumber);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", vendorEmail);
            throw;
        }
    }
}
