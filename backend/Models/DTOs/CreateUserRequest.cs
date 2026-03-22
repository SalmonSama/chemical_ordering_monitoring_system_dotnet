namespace ChemWatch.Models.DTOs;

public class CreateUserRequest
{
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Guid RoleId { get; set; }
    public string LocationScopeType { get; set; } = "specific";
    public List<Guid> LocationIds { get; set; } = new();
    public bool IsActive { get; set; } = true;
}
