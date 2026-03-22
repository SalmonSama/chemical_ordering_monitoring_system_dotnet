namespace ChemWatch.Models;

public class UserLocation
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid LocationId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
    public Location Location { get; set; } = null!;
}
