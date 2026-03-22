// This file is deprecated. Use UserLocation.cs instead.
// Kept temporarily to avoid compilation errors in existing migrations.
// Do not use this class in new code.

namespace ChemWatch.Models;

public class UserLab
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid LabId { get; set; }
    public bool IsDefault { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
