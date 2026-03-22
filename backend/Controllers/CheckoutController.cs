using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;
using System.Text.Json;

namespace ChemWatch.Controllers;

[ApiController]
[Route("api/checkout")]
public class CheckoutController : ControllerBase
{
    private readonly AppDbContext _db;

    public CheckoutController(AppDbContext db) => _db = db;

    // ── GET /api/checkout/lookup/{lotNumber} — Lot lookup for checkout ──────
    [HttpGet("lookup/{lotNumber}")]
    public async Task<IActionResult> LookupLot(string lotNumber)
    {
        var lot = await _db.InventoryLots
            .Include(l => l.Item)
            .Include(l => l.Lab)
            .Include(l => l.Location)
            .Include(l => l.Vendor)
            .FirstOrDefaultAsync(l => l.LotNumber == lotNumber);

        if (lot == null)
            return NotFound(new { error = "Inventory lot not found." });

        if (lot.QuantityRemaining <= 0 || lot.Status == "consumed")
            return BadRequest(new { error = "This lot has already been fully consumed." });

        if (lot.Status == "disposed" || lot.Status == "expired")
            return BadRequest(new { error = $"Cannot checkout from a lot with status: {lot.Status}." });

        return Ok(new
        {
            id = lot.Id,
            itemId = lot.ItemId,
            itemName = lot.Item.ItemName,
            labName = lot.Lab.Name,
            locationName = lot.Location.Name,
            vendorName = lot.Vendor?.Name,
            lotNumber = lot.LotNumber,
            quantityRemaining = lot.QuantityRemaining,
            unit = lot.Unit,
            expiryDate = lot.ExpiryDate,
            status = lot.Status
        });
    }

    // ── POST /api/checkout/confirm — Execute checkout ─────────────────────
    [HttpPost("confirm")]
    public async Task<IActionResult> ConfirmCheckout([FromBody] CheckoutConfirmRequest request)
    {
        var lot = await _db.InventoryLots
            .Include(l => l.Item)
            .FirstOrDefaultAsync(l => l.Id == request.InventoryLotId);

        if (lot == null)
            return NotFound(new { error = "Inventory lot not found." });

        if (lot.Status != "active")
            return BadRequest(new { error = $"Cannot checkout from a lot with status: {lot.Status}." });

        if (request.Quantity <= 0)
            return BadRequest(new { error = "Checkout quantity must be greater than zero." });

        if (request.Quantity > lot.QuantityRemaining)
            return BadRequest(new { error = $"Requested quantity ({request.Quantity}) exceeds remaining quantity ({lot.QuantityRemaining})." });

        var user = await _db.Users.FindAsync(request.PerformedByUserId);
        if (user == null)
            return BadRequest(new { error = "User not found." });

        var now = DateTime.UtcNow;

        // Deduct quantity
        lot.QuantityRemaining -= request.Quantity;
        lot.UpdatedAt = now;

        // Update status if zero
        if (lot.QuantityRemaining == 0)
        {
            lot.Status = "consumed";
        }

        // Create transaction history
        var metadata = new
        {
            lot_id = lot.Id.ToString(),
            lot_number = lot.LotNumber,
            chemical_name = lot.Item.ItemName,
            quantity_checked_out = request.Quantity,
            quantity_remaining = lot.QuantityRemaining,
            unit = lot.Unit,
            new_status = lot.Status
        };

        var txn = new StockTransaction
        {
            Id = Guid.NewGuid(),
            TransactionType = "check_out",
            UserId = request.PerformedByUserId,
            UserName = user.FullName,
            LabId = lot.LabId,
            LocationId = lot.LocationId,
            LotId = lot.Id,
            ItemId = lot.ItemId,
            Quantity = -request.Quantity, // negative to denote consumption
            Notes = request.Notes?.Trim(),
            Metadata = JsonSerializer.Serialize(metadata),
            CreatedAt = now,
        };

        _db.StockTransactions.Add(txn);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Checkout successful.",
            inventoryLot = new
            {
                id = lot.Id,
                lotNumber = lot.LotNumber,
                quantityRemaining = lot.QuantityRemaining,
                status = lot.Status,
                updatedAt = lot.UpdatedAt
            },
            stockTransaction = new
            {
                id = txn.Id,
                transactionType = txn.TransactionType,
                quantity = txn.Quantity,
                createdAt = txn.CreatedAt
            }
        });
    }
}

// ── DTOs ────────────────────────────────────────────────────────────────
public record CheckoutConfirmRequest
{
    public Guid InventoryLotId { get; init; }
    public decimal Quantity { get; init; }
    public Guid PerformedByUserId { get; init; }
    public string? Notes { get; init; }
}
