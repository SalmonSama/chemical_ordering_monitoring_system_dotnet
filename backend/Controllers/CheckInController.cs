using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;
using System.Text.Json;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/checkin")]
public class CheckInController : ControllerBase
{
    private readonly AppDbContext _db;

    public CheckInController(AppDbContext db) => _db = db;

    [HttpPost("manual")]
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
}
