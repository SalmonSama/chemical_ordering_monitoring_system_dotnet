namespace ChemWatch.Models;

public class UserLab
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid LabId { get; set; }
    public bool IsDefault { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public Lab Lab { get; set; } = null!;
}
