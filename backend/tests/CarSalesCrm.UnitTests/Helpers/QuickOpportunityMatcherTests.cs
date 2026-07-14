using CarSalesCrm.Application.Common.Helpers;
using CarSalesCrm.Domain.Entities;
using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.UnitTests.Helpers;

public class QuickOpportunityMatcherTests
{
    [Fact]
    public void CarroZero_Should_Match_Only_Zero_Mileage_Available()
    {
        var vehicles = new[]
        {
            Create(VehicleType.Sedan, VehicleStatus.Disponivel, 0),
            Create(VehicleType.Sedan, VehicleStatus.Disponivel, 1000)
        };

        var id = QuickOpportunityMatcher.FindMatchingVehicleId(CustomerInterest.CarroZero, vehicles);
        Assert.Equal(vehicles[0].Id, id);
    }

    [Fact]
    public void Sedan_Should_Match_Type_And_Available()
    {
        var vehicles = new[]
        {
            Create(VehicleType.SUV, VehicleStatus.Disponivel, 1000),
            Create(VehicleType.Sedan, VehicleStatus.Reservado, 1000),
            Create(VehicleType.Sedan, VehicleStatus.Disponivel, 5000)
        };

        var id = QuickOpportunityMatcher.FindMatchingVehicleId(CustomerInterest.Sedan, vehicles);
        Assert.Equal(vehicles[2].Id, id);
    }

    [Fact]
    public void CarroUsado_Should_Match_Mileage_Greater_Than_Zero()
    {
        var vehicles = new[]
        {
            Create(VehicleType.Hatch, VehicleStatus.Disponivel, 0),
            Create(VehicleType.Hatch, VehicleStatus.Disponivel, 12)
        };

        var id = QuickOpportunityMatcher.FindMatchingVehicleId(CustomerInterest.CarroUsado, vehicles);
        Assert.Equal(vehicles[1].Id, id);
    }

    private static Vehicle Create(VehicleType type, VehicleStatus status, int mileage) =>
        new()
        {
            Id = Guid.NewGuid(),
            Brand = "Test",
            Model = "Car",
            Year = 2024,
            Price = 100000,
            Color = "Branco",
            Mileage = mileage,
            Type = type,
            Status = status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
}
