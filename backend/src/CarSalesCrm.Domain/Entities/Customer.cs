using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.Domain.Entities;

public class Customer
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public CustomerInterest PrimaryInterest { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public DateTime LastModifiedAt => UpdatedAt ?? CreatedAt;

    public ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();
}
