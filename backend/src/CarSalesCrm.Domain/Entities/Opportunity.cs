using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.Domain.Entities;

public class Opportunity
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid VehicleId { get; set; }
    public OpportunityStatus Status { get; set; }
    public decimal ProposedValue { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public DateTime LastModifiedAt => UpdatedAt ?? CreatedAt;

    public Customer Customer { get; set; } = null!;
    public Vehicle Vehicle { get; set; } = null!;
}
