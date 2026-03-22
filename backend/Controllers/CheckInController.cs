using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;
using System.Text.Json;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/checkin")]
[Authorize]
public class CheckInController : ControllerBase
{
    private readonly AppDbContext _db;

    public CheckInController(AppDbContext db) => _db = db;

    [HttpPost("manual")]
    [Authorize(Roles = "admin,focal_point")]
    public async Task<IActionResult> ManualCheckIn([FromBody] ManualCheckInRequest request)
    {
        // ── Validate references ──────────────────────────────────────
        var item = await _db.Items.FindAsync(request.ItemId);
        if (item == null)
            return BadRequest(new { error = "Item not found." });

        var lab = await _db.Labs.FindAsync(request.LabId);
        if (lab == null)
            return BadRequest(new { error = "Lab not found." });

        var location = await _db.Locations.FindAsync(request.LocationId);
        if (location == null)
            return BadRequest(new { error = "Location not found." });

        if (request.VendorId.HasValue)
        {
            var vendor = await _db.Vendors.FindAsync(request.VendorId.Value);
            if (vendor == null)
                return BadRequest(new { error = "Vendor not found." });
        }

        var user = await _db.Users.FindAsync(request.PerformedByUserId);
        if (user == null)
            return BadRequest(new { error = "User (PerformedByUserId) not found." });

        if (request.Quantity <= 0)
            return BadRequest(new { error = "Quantity must be greater than zero." });

        if (string.IsNullOrWhiteSpace(request.LotNumber))
            return BadRequest(new { error = "Lot number is required." });

        // ── Determine lot status ─────────────────────────────────────
        var status = "active";
        if (request.ExpiryDate.HasValue && request.ExpiryDate.Value.Date < DateTime.UtcNow.Date)
        {
            status = "expired";
        }

        // ── Create InventoryLot ──────────────────────────────────────
        var now = DateTime.UtcNow;
        var lot = new InventoryLot
        {
            Id = Guid.NewGuid(),
            ItemId = request.ItemId,
            LabId = request.LabId,
            LocationId = request.LocationId,
            VendorId = request.VendorId,
            LotNumber = request.LotNumber.Trim(),
            QuantityReceived = request.Quantity,
            QuantityRemaining = request.Quantity,
            Unit = string.IsNullOrWhiteSpace(request.Unit) ? item.Unit : request.Unit.Trim(),
            ManufactureDate = request.ManufactureDate,
            ExpiryDate = request.ExpiryDate,
            StorageSublocation = request.StorageSublocation?.Trim(),
            Status = status,
            SourceType = "manual",
            CheckedInBy = request.PerformedByUserId,
            CheckedInAt = now,
            ManualSourceReason = request.SourceReason?.Trim(),
            Notes = request.Notes?.Trim(),
            CreatedAt = now,
        };

        _db.InventoryLots.Add(lot);

        // ── Create StockTransaction ──────────────────────────────────
        var metadata = new
        {
            lot_id = lot.Id.ToString(),
            chemical_name = item.ItemName,
            lot_number = lot.LotNumber,
            quantity_received = lot.QuantityReceived,
            unit = lot.Unit,
            expiry_date = lot.ExpiryDate?.ToString("yyyy-MM-dd"),
            source_type = lot.ManualSourceReason ?? "manual",
            source_reason = request.Notes,
        };

        var txn = new StockTransaction
        {
            Id = Guid.NewGuid(),
            TransactionType = "manual_check_in",
            UserId = request.PerformedByUserId,
            UserName = user.FullName,
            LabId = request.LabId,
            LocationId = request.LocationId,
            LotId = lot.Id,
            ItemId = request.ItemId,
            Quantity = request.Quantity,
            Notes = request.Notes?.Trim(),
            Metadata = JsonSerializer.Serialize(metadata),
            CreatedAt = now,
        };

        _db.StockTransactions.Add(txn);

        await _db.SaveChangesAsync();

        // ── Return result ────────────────────────────────────────────
        return CreatedAtAction(
            nameof(ManualCheckIn),
            new
            {
                message = "Manual check-in completed successfully.",
                inventoryLot = new
                {
                    lot.Id,
                    lot.ItemId,
                    itemName = item.ItemName,
                    lot.LabId,
                    labName = lab.Name,
                    lot.LocationId,
                    locationName = location.Name,
                    lot.LotNumber,
                    lot.QuantityReceived,
                    lot.QuantityRemaining,
                    lot.Unit,
                    lot.ExpiryDate,
                    lot.Status,
                    lot.SourceType,
                    lot.CheckedInAt,
                },
                stockTransaction = new
                {
                    txn.Id,
                    txn.TransactionType,
                    txn.UserName,
                    txn.Quantity,
                    txn.CreatedAt,
                }
            }
        );
    }

    // ── GET /api/checkin/pending-delivery — List receivable items ──────
    [HttpGet("pending-delivery")]
    public async Task<IActionResult> ListPendingDelivery()
    {
        // Receivable statuses: approved, partially_received
        var receivableStatuses = new[] { "approved", "partially_received" };

        var items = await _db.PurchaseRequestItems
            .Include(pri => pri.PurchaseRequest).ThenInclude(pr => pr.Lab)
            .Include(pri => pri.PurchaseRequest).ThenInclude(pr => pr.Location)
            .Include(pri => pri.PurchaseRequest).ThenInclude(pr => pr.RequestedByUser)
            .Include(pri => pri.Item)
            .Include(pri => pri.Vendor)
            .Where(pri => receivableStatuses.Contains(pri.PurchaseRequest.Status)
                       && pri.Status != "removed"
                       && pri.Status != "fully_received")
            .OrderByDescending(pri => pri.PurchaseRequest.ApprovedAt)
            .ToListAsync();

        var result = items.Select(pri => new
        {
            purchaseRequestItemId = pri.Id,
            purchaseRequestId = pri.PurchaseRequestId,
            poNumber = pri.PurchaseRequest.PoNumber,
            itemId = pri.ItemId,
            itemName = pri.Item.ItemName,
            itemUnit = pri.Item.Unit,
            vendorId = pri.VendorId,
            vendorName = pri.Vendor?.Name,
            labId = pri.PurchaseRequest.LabId,
            labName = pri.PurchaseRequest.Lab.Name,
            locationId = pri.PurchaseRequest.LocationId,
            locationName = pri.PurchaseRequest.Location.Name,
            requestedBy = pri.PurchaseRequest.RequestedByUser?.FullName,
            quantityOrdered = pri.QuantityOrdered,
            quantityReceived = pri.QuantityReceived,
            quantityRemaining = pri.QuantityOrdered - pri.QuantityReceived,
            unit = pri.Unit,
            status = pri.Status,
            approvedAt = pri.PurchaseRequest.ApprovedAt,
        });

        return Ok(result);
    }

    // ── POST /api/checkin/from-pending-delivery — PO check-in ─────────
    [HttpPost("from-pending-delivery")]
    public async Task<IActionResult> CheckInFromPendingDelivery([FromBody] PendingDeliveryCheckInRequest request)
    {
        // Load line item with order
        var lineItem = await _db.PurchaseRequestItems
            .Include(pri => pri.Item)
            .Include(pri => pri.Vendor)
            .Include(pri => pri.PurchaseRequest).ThenInclude(pr => pr.Lab)
            .Include(pri => pri.PurchaseRequest).ThenInclude(pr => pr.Location)
            .Include(pri => pri.PurchaseRequest).ThenInclude(pr => pr.Items)
            .FirstOrDefaultAsync(pri => pri.Id == request.PurchaseRequestItemId);

        if (lineItem == null)
            return NotFound(new { error = "Purchase request item not found." });

        var order = lineItem.PurchaseRequest;

        // Validate order is receivable
        if (order.Status != "approved" && order.Status != "partially_received")
            return BadRequest(new { error = $"Cannot receive items for order in '{order.Status}' status." });

        // Validate line item is receivable
        if (lineItem.Status == "fully_received")
            return BadRequest(new { error = "Line item is already fully received." });
        if (lineItem.Status == "removed")
            return BadRequest(new { error = "Line item has been removed." });

        // Validate quantity
        if (request.ReceivedQuantity <= 0)
            return BadRequest(new { error = "Received quantity must be greater than zero." });

        var remaining = lineItem.QuantityOrdered - lineItem.QuantityReceived;
        if (request.ReceivedQuantity > remaining)
            return BadRequest(new { error = $"Received quantity ({request.ReceivedQuantity}) exceeds remaining ({remaining})." });

        if (string.IsNullOrWhiteSpace(request.LotNumber))
            return BadRequest(new { error = "Lot number is required." });

        // Validate user
        var user = await _db.Users.FindAsync(request.PerformedByUserId);
        if (user == null)
            return BadRequest(new { error = "User not found." });

        var now = DateTime.UtcNow;

        // Determine lot status
        var lotStatus = "active";
        if (request.ExpiryDate.HasValue && request.ExpiryDate.Value.Date < DateTime.UtcNow.Date)
            lotStatus = "expired";

        // Create InventoryLot
        var lot = new InventoryLot
        {
            Id = Guid.NewGuid(),
            ItemId = lineItem.ItemId,
            LabId = order.LabId,
            LocationId = order.LocationId,
            VendorId = lineItem.VendorId,
            LotNumber = request.LotNumber.Trim(),
            QuantityReceived = request.ReceivedQuantity,
            QuantityRemaining = request.ReceivedQuantity,
            Unit = lineItem.Unit,
            ExpiryDate = request.ExpiryDate,
            StorageSublocation = request.StorageSublocation?.Trim(),
            Status = lotStatus,
            SourceType = "purchase_order",
            PurchaseRequestId = order.Id,
            PurchaseRequestItemId = lineItem.Id,
            CheckedInBy = request.PerformedByUserId,
            CheckedInAt = now,
            Notes = request.Notes?.Trim(),
            CreatedAt = now,
        };

        _db.InventoryLots.Add(lot);

        // Create StockTransaction
        var metadata = new
        {
            lot_id = lot.Id.ToString(),
            order_id = order.Id.ToString(),
            po_number = order.PoNumber,
            line_item_id = lineItem.Id.ToString(),
            chemical_name = lineItem.Item.ItemName,
            lot_number = lot.LotNumber,
            quantity_received = request.ReceivedQuantity,
            unit = lineItem.Unit,
            expiry_date = request.ExpiryDate?.ToString("yyyy-MM-dd"),
            source_type = "purchase_order",
        };

        var txn = new StockTransaction
        {
            Id = Guid.NewGuid(),
            TransactionType = "check_in",
            UserId = request.PerformedByUserId,
            UserName = user.FullName,
            LabId = order.LabId,
            LocationId = order.LocationId,
            LotId = lot.Id,
            PurchaseRequestId = order.Id,
            ItemId = lineItem.ItemId,
            Quantity = request.ReceivedQuantity,
            Notes = request.Notes?.Trim(),
            Metadata = JsonSerializer.Serialize(metadata),
            CreatedAt = now,
        };

        _db.StockTransactions.Add(txn);

        // Update line item receiving status
        lineItem.QuantityReceived += request.ReceivedQuantity;
        lineItem.UpdatedAt = now;

        if (lineItem.QuantityReceived >= lineItem.QuantityOrdered)
            lineItem.Status = "fully_received";
        else
            lineItem.Status = "partially_received";

        // Recompute order status from aggregate
        var activeItems = order.Items.Where(i => i.Status != "removed").ToList();
        var allFullyReceived = activeItems.All(i => i.Status == "fully_received" || i.Id == lineItem.Id && lineItem.QuantityReceived >= lineItem.QuantityOrdered);
        var anyReceived = activeItems.Any(i => i.QuantityReceived > 0 || i.Id == lineItem.Id);

        if (allFullyReceived)
            order.Status = "fully_received";
        else if (anyReceived)
            order.Status = "partially_received";

        order.UpdatedAt = now;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Check-in completed successfully.",
            inventoryLot = new
            {
                lot.Id,
                lot.ItemId,
                itemName = lineItem.Item.ItemName,
                lot.LabId,
                labName = order.Lab.Name,
                lot.LocationId,
                locationName = order.Location.Name,
                lot.LotNumber,
                lot.QuantityReceived,
                lot.QuantityRemaining,
                lot.Unit,
                lot.ExpiryDate,
                lot.Status,
                lot.SourceType,
                lot.CheckedInAt,
            },
            lineItem = new
            {
                lineItem.Id,
                lineItem.QuantityOrdered,
                lineItem.QuantityReceived,
                remaining = lineItem.QuantityOrdered - lineItem.QuantityReceived,
                lineItem.Status,
            },
            orderStatus = order.Status,
        });
    }
}

// ── DTO ───────────────────────────────────────────────────────────────

public record PendingDeliveryCheckInRequest
{
    public Guid PurchaseRequestItemId { get; init; }
    public decimal ReceivedQuantity { get; init; }
    public string LotNumber { get; init; } = string.Empty;
    public DateTime? ExpiryDate { get; init; }
    public string? StorageSublocation { get; init; }
    public string? Notes { get; init; }
    public Guid PerformedByUserId { get; init; }
}
