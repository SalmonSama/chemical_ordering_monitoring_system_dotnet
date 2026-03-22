using System;

namespace ChemWatch.Models;

public class PeroxideTest
{
    public Guid Id { get; set; }
    
    public Guid InventoryLotId { get; set; }
    public InventoryLot InventoryLot { get; set; } = null!;
    
    public DateTime TestDate { get; set; }
    public Guid TestedByUserId { get; set; }
    public User TestedByUser { get; set; } = null!;
    
    public string? TestMethod { get; set; } // e.g. Test strip, Titration
    public string ResultType { get; set; } = "NUMERIC"; // NUMERIC or TEXTUAL
    public decimal? PpmResult { get; set; }
    public string? ResultText { get; set; }
    
    public string Classification { get; set; } = "Normal"; // Normal, Warning, Quarantine
    public string? VisualObservations { get; set; }
    public string? Notes { get; set; }
    
    public DateTime? NextMonitorDue { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
