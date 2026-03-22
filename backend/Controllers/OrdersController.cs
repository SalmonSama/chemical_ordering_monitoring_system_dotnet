using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;
using System.Text.Json;

namespace ChemWatch.Controllers;

// ── DTOs ──────────────────────────────────────────────────────────────

public record SubmitOrderRequest
{
    public Guid RequestedBy { get; init; }
    public Guid LabId { get; init; }
    public Guid LocationId { get; init; }
    public string? OrderNotes { get; init; }
    public List<SubmitOrderLineItem> Items { get; init; } = new();
}

public record SubmitOrderLineItem
{
    public Guid ItemId { get; init; }
    public Guid? VendorId { get; init; }
    public decimal Quantity { get; init; }
    public string? Note { get; init; }
}

public record ModifyOrderRequest
{
    public Guid ModifiedBy { get; init; }
    public string? Notes { get; init; }
    public List<ModifyLineItem> Items { get; init; } = new();
}

public record ModifyLineItem
{
    public Guid LineItemId { get; init; }
    public decimal? NewQuantity { get; init; }   // null = no change
    public Guid? NewVendorId { get; init; }      // null = no change
    public bool Remove { get; init; } = false;
}

public record ApproveOrderRequest
{
    public Guid ApprovedBy { get; init; }
    public string? ApprovalNotes { get; init; }
}

// ── Controller ────────────────────────────────────────────────────────

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db) => _db = db;

    // ── POST /api/orders — Submit a new order ─────────────────────────
    [HttpPost]
    public async Task<IActionResult> SubmitOrder([FromBody] SubmitOrderRequest request)
    {
        // Validate references
        var user = await _db.Users.FindAsync(request.RequestedBy);
        if (user == null) return BadRequest(new { error = "User not found." });

        var lab = await _db.Labs.FindAsync(request.LabId);
        if (lab == null) return BadRequest(new { error = "Lab not found." });

        var location = await _db.Locations.FindAsync(request.LocationId);
        if (location == null) return BadRequest(new { error = "Location not found." });

        if (request.Items.Count == 0)
            return BadRequest(new { error = "Order must contain at least one item." });

        // Validate each line item
        foreach (var line in request.Items)
        {
            var item = await _db.Items.FindAsync(line.ItemId);
            if (item == null) return BadRequest(new { error = $"Item {line.ItemId} not found." });
            if (!item.IsOrderable) return BadRequest(new { error = $"Item '{item.ItemName}' is not orderable." });
            if (line.Quantity <= 0) return BadRequest(new { error = $"Quantity must be > 0 for item '{item.ItemName}'." });

            if (line.VendorId.HasValue)
            {
                var vendor = await _db.Vendors.FindAsync(line.VendorId.Value);
                if (vendor == null) return BadRequest(new { error = $"Vendor {line.VendorId} not found." });
            }
        }

        // Generate PO number: PO-{year}-{seq:0000}
        var year = DateTime.UtcNow.Year;
        var existingCount = await _db.PurchaseRequests
            .CountAsync(pr => pr.PoNumber.StartsWith($"PO-{year}-"));
        var poNumber = $"PO-{year}-{(existingCount + 1):D4}";

        var now = DateTime.UtcNow;

        var purchaseRequest = new PurchaseRequest
        {
            Id = Guid.NewGuid(),
            PoNumber = poNumber,
            LabId = request.LabId,
            LocationId = request.LocationId,
            RequestedBy = request.RequestedBy,
            Status = "pending_approval",
            OrderNotes = request.OrderNotes?.Trim(),
            SubmittedAt = now,
            CreatedAt = now,
        };

        _db.PurchaseRequests.Add(purchaseRequest);

        // Create line items
        var lineItemsForMetadata = new List<object>();

        foreach (var line in request.Items)
        {
            var item = await _db.Items.Include(i => i.DefaultVendor).FirstAsync(i => i.Id == line.ItemId);
            var vendorId = line.VendorId ?? item.DefaultVendorId;

            var pri = new PurchaseRequestItem
            {
                Id = Guid.NewGuid(),
                PurchaseRequestId = purchaseRequest.Id,
                ItemId = line.ItemId,
                VendorId = vendorId,
                QuantityOrdered = line.Quantity,
                Unit = item.Unit,
                UnitPrice = item.ReferencePrice,
                LineItemNotes = line.Note?.Trim(),
                Status = "pending",
                CreatedAt = now,
            };

            _db.PurchaseRequestItems.Add(pri);

            lineItemsForMetadata.Add(new
            {
                chemical_id = item.Id.ToString(),
                chemical_name = item.ItemName,
                quantity = line.Quantity,
                unit = item.Unit,
                vendor = item.DefaultVendor?.Name ?? "N/A",
            });
        }

        // Create audit transaction
        var metadata = new
        {
            order_id = purchaseRequest.Id.ToString(),
            po_number = poNumber,
            line_items = lineItemsForMetadata,
            total_line_items = request.Items.Count,
        };

        var txn = new StockTransaction
        {
            Id = Guid.NewGuid(),
            TransactionType = "submit_order",
            UserId = request.RequestedBy,
            UserName = user.FullName,
            LabId = request.LabId,
            LocationId = request.LocationId,
            PurchaseRequestId = purchaseRequest.Id,
            Notes = request.OrderNotes?.Trim(),
            Metadata = JsonSerializer.Serialize(metadata),
            CreatedAt = now,
        };

        _db.StockTransactions.Add(txn);

        await _db.SaveChangesAsync();

        // Return created order
        var created = await _db.PurchaseRequests
            .Include(pr => pr.Lab)
            .Include(pr => pr.Location)
            .Include(pr => pr.RequestedByUser)
            .Include(pr => pr.Items).ThenInclude(i => i.Item)
            .Include(pr => pr.Items).ThenInclude(i => i.Vendor)
            .FirstAsync(pr => pr.Id == purchaseRequest.Id);

        return CreatedAtAction(nameof(GetOrder), new { id = created.Id }, FormatOrder(created));
    }

    // ── GET /api/orders — List orders ─────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> ListOrders([FromQuery] string? status, [FromQuery] Guid? labId)
    {
        var query = _db.PurchaseRequests
            .Include(pr => pr.Lab)
            .Include(pr => pr.Location)
            .Include(pr => pr.RequestedByUser)
            .Include(pr => pr.Items)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(pr => pr.Status == status);

        if (labId.HasValue)
            query = query.Where(pr => pr.LabId == labId.Value);

        var orders = await query
            .OrderByDescending(pr => pr.SubmittedAt)
            .ToListAsync();

        return Ok(orders.Select(FormatOrderSummary));
    }

    // ── GET /api/orders/{id} — Order detail ───────────────────────────
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var order = await _db.PurchaseRequests
            .Include(pr => pr.Lab)
            .Include(pr => pr.Location)
            .Include(pr => pr.RequestedByUser)
            .Include(pr => pr.ApprovedByUser)
            .Include(pr => pr.Items).ThenInclude(i => i.Item)
            .Include(pr => pr.Items).ThenInclude(i => i.Vendor)
            .Include(pr => pr.Revisions).ThenInclude(r => r.RevisedByUser)
            .FirstOrDefaultAsync(pr => pr.Id == id);

        if (order == null) return NotFound(new { error = "Order not found." });

        return Ok(FormatOrder(order));
    }

    // ── PUT /api/orders/{id}/modify — Focal point modify ──────────────
    [HttpPut("{id:guid}/modify")]
    [Authorize(Roles = "admin,focal_point")]
    public async Task<IActionResult> ModifyOrder(Guid id, [FromBody] ModifyOrderRequest request)
    {
        var order = await _db.PurchaseRequests
            .Include(pr => pr.Items).ThenInclude(i => i.Item)
            .Include(pr => pr.Items).ThenInclude(i => i.Vendor)
            .FirstOrDefaultAsync(pr => pr.Id == id);

        if (order == null) return NotFound(new { error = "Order not found." });

        if (order.Status != "pending_approval" && order.Status != "modified")
            return BadRequest(new { error = $"Cannot modify order in '{order.Status}' status." });

        var modifier = await _db.Users.FindAsync(request.ModifiedBy);
        if (modifier == null) return BadRequest(new { error = "Modifier user not found." });

        var now = DateTime.UtcNow;
        var changesForMetadata = new List<object>();

        foreach (var mod in request.Items)
        {
            var lineItem = order.Items.FirstOrDefault(i => i.Id == mod.LineItemId);
            if (lineItem == null)
                return BadRequest(new { error = $"Line item {mod.LineItemId} not found in this order." });

            if (mod.Remove)
            {
                // Record removal revision
                _db.PurchaseRequestItemRevisions.Add(new PurchaseRequestItemRevision
                {
                    Id = Guid.NewGuid(),
                    PurchaseRequestItemId = lineItem.Id,
                    PurchaseRequestId = order.Id,
                    Action = "removed",
                    RevisedBy = request.ModifiedBy,
                    RevisedAt = now,
                    Notes = request.Notes,
                });

                lineItem.Status = "removed";
                lineItem.UpdatedAt = now;

                changesForMetadata.Add(new { chemical_name = lineItem.Item.ItemName, action = "removed" });
                continue;
            }

            // Quantity change
            if (mod.NewQuantity.HasValue && mod.NewQuantity.Value != lineItem.QuantityOrdered)
            {
                _db.PurchaseRequestItemRevisions.Add(new PurchaseRequestItemRevision
                {
                    Id = Guid.NewGuid(),
                    PurchaseRequestItemId = lineItem.Id,
                    PurchaseRequestId = order.Id,
                    Action = "modified",
                    FieldName = "quantity_ordered",
                    OldValue = lineItem.QuantityOrdered.ToString(),
                    NewValue = mod.NewQuantity.Value.ToString(),
                    RevisedBy = request.ModifiedBy,
                    RevisedAt = now,
                    Notes = request.Notes,
                });

                changesForMetadata.Add(new
                {
                    chemical_name = lineItem.Item.ItemName,
                    field = "quantity",
                    old_value = lineItem.QuantityOrdered,
                    new_value = mod.NewQuantity.Value,
                });

                lineItem.QuantityOrdered = mod.NewQuantity.Value;
                lineItem.UpdatedAt = now;
            }

            // Vendor change
            if (mod.NewVendorId.HasValue && mod.NewVendorId.Value != lineItem.VendorId)
            {
                var newVendor = await _db.Vendors.FindAsync(mod.NewVendorId.Value);
                if (newVendor == null)
                    return BadRequest(new { error = $"Vendor {mod.NewVendorId.Value} not found." });

                _db.PurchaseRequestItemRevisions.Add(new PurchaseRequestItemRevision
                {
                    Id = Guid.NewGuid(),
                    PurchaseRequestItemId = lineItem.Id,
                    PurchaseRequestId = order.Id,
                    Action = "modified",
                    FieldName = "vendor_id",
                    OldValue = lineItem.VendorId?.ToString(),
                    NewValue = mod.NewVendorId.Value.ToString(),
                    RevisedBy = request.ModifiedBy,
                    RevisedAt = now,
                    Notes = request.Notes,
                });

                changesForMetadata.Add(new
                {
                    chemical_name = lineItem.Item.ItemName,
                    field = "vendor",
                    old_value = lineItem.Vendor?.Name ?? "N/A",
                    new_value = newVendor.Name,
                });

                lineItem.VendorId = mod.NewVendorId.Value;
                lineItem.UpdatedAt = now;
            }
        }

        order.Status = "modified";
        order.LastModifiedBy = request.ModifiedBy;
        order.LastModifiedAt = now;
        order.UpdatedAt = now;

        // Audit transaction
        var metadata = new
        {
            order_id = order.Id.ToString(),
            po_number = order.PoNumber,
            modifier_user_id = request.ModifiedBy.ToString(),
            changes = changesForMetadata,
        };

        _db.StockTransactions.Add(new StockTransaction
        {
            Id = Guid.NewGuid(),
            TransactionType = "modify_order",
            UserId = request.ModifiedBy,
            UserName = modifier.FullName,
            LabId = order.LabId,
            LocationId = order.LocationId,
            PurchaseRequestId = order.Id,
            Notes = request.Notes,
            Metadata = JsonSerializer.Serialize(metadata),
            CreatedAt = now,
        });

        await _db.SaveChangesAsync();

        // Reload and return
        var updated = await _db.PurchaseRequests
            .Include(pr => pr.Lab)
            .Include(pr => pr.Location)
            .Include(pr => pr.RequestedByUser)
            .Include(pr => pr.Items).ThenInclude(i => i.Item)
            .Include(pr => pr.Items).ThenInclude(i => i.Vendor)
            .Include(pr => pr.Revisions).ThenInclude(r => r.RevisedByUser)
            .FirstAsync(pr => pr.Id == id);

        return Ok(FormatOrder(updated));
    }

    // ── PUT /api/orders/{id}/approve — Approve order ──────────────────
    [HttpPut("{id:guid}/approve")]
    [Authorize(Roles = "admin,focal_point")]
    public async Task<IActionResult> ApproveOrder(Guid id, [FromBody] ApproveOrderRequest request)
    {
        var order = await _db.PurchaseRequests
            .Include(pr => pr.Items)
            .FirstOrDefaultAsync(pr => pr.Id == id);

        if (order == null) return NotFound(new { error = "Order not found." });

        if (order.Status != "pending_approval" && order.Status != "modified")
            return BadRequest(new { error = $"Cannot approve order in '{order.Status}' status." });

        var approver = await _db.Users.FindAsync(request.ApprovedBy);
        if (approver == null) return BadRequest(new { error = "Approver user not found." });

        // Must have at least one active (non-removed) line item
        var activeItems = order.Items.Where(i => i.Status != "removed").ToList();
        if (activeItems.Count == 0)
            return BadRequest(new { error = "Cannot approve an order with no active line items." });

        var now = DateTime.UtcNow;

        order.Status = "approved";
        order.ApprovedBy = request.ApprovedBy;
        order.ApprovedAt = now;
        order.ApprovalNotes = request.ApprovalNotes?.Trim();
        order.UpdatedAt = now;

        // Audit transaction
        var metadata = new
        {
            order_id = order.Id.ToString(),
            po_number = order.PoNumber,
            approver_user_id = request.ApprovedBy.ToString(),
        };

        _db.StockTransactions.Add(new StockTransaction
        {
            Id = Guid.NewGuid(),
            TransactionType = "approve_order",
            UserId = request.ApprovedBy,
            UserName = approver.FullName,
            LabId = order.LabId,
            LocationId = order.LocationId,
            PurchaseRequestId = order.Id,
            Notes = request.ApprovalNotes?.Trim(),
            Metadata = JsonSerializer.Serialize(metadata),
            CreatedAt = now,
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Order approved successfully.",
            orderId = order.Id,
            poNumber = order.PoNumber,
            status = order.Status,
            approvedBy = approver.FullName,
            approvedAt = order.ApprovedAt,
        });
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private static object FormatOrderSummary(PurchaseRequest pr) => new
    {
        pr.Id,
        pr.PoNumber,
        pr.Status,
        labName = pr.Lab?.Name,
        locationName = pr.Location?.Name,
        requestedBy = pr.RequestedByUser?.FullName,
        pr.SubmittedAt,
        itemCount = pr.Items.Count(i => i.Status != "removed"),
        totalQty = pr.Items.Where(i => i.Status != "removed").Sum(i => i.QuantityOrdered),
    };

    private static object FormatOrder(PurchaseRequest pr) => new
    {
        pr.Id,
        pr.PoNumber,
        pr.LabId,
        labName = pr.Lab?.Name,
        pr.LocationId,
        locationName = pr.Location?.Name,
        pr.RequestedBy,
        requestedByName = pr.RequestedByUser?.FullName,
        pr.Status,
        pr.OrderNotes,
        pr.ApprovalNotes,
        pr.ApprovedBy,
        approvedByName = pr.ApprovedByUser?.FullName,
        pr.ApprovedAt,
        pr.RejectedReason,
        pr.SubmittedAt,
        pr.LastModifiedBy,
        pr.LastModifiedAt,
        pr.CreatedAt,
        items = pr.Items.Select(i => new
        {
            i.Id,
            i.ItemId,
            itemName = i.Item?.ItemName,
            itemUnit = i.Item?.Unit,
            i.VendorId,
            vendorName = i.Vendor?.Name,
            i.QuantityOrdered,
            i.QuantityReceived,
            i.Unit,
            i.UnitPrice,
            i.LineItemNotes,
            i.Status,
        }),
        revisions = pr.Revisions?.Select(r => new
        {
            r.Id,
            r.PurchaseRequestItemId,
            r.Action,
            r.FieldName,
            r.OldValue,
            r.NewValue,
            r.RevisedBy,
            revisedByName = r.RevisedByUser?.FullName,
            r.RevisedAt,
            r.Notes,
        }),
    };
}
