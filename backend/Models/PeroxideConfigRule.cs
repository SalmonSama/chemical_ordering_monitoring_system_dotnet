namespace ChemWatch.Models;

public class PeroxideConfigRule
{
    public Guid Id { get; set; }
    public string PeroxideClass { get; set; } = string.Empty; // e.g., Peroxide_A, Peroxide_B
    public bool TestBeforeUse { get; set; } = false;
    public int? TestIntervalMonths { get; set; }
    public int? DisposeAfterOpeningMonths { get; set; }
    public int? DisposeAfterReceiptMonths { get; set; }
}
