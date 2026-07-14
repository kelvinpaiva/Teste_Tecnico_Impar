using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.Domain.Entities;

public class Vehicle
{
    public Guid Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Price { get; set; }
    public string Color { get; set; } = string.Empty;
    public int Mileage { get; set; }
    public VehicleType Type { get; set; }
    public VehicleStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public DateTime LastModifiedAt => UpdatedAt ?? CreatedAt;

    public ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();
}
