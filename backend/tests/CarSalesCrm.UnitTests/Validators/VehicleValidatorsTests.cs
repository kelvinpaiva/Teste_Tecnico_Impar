using CarSalesCrm.Application.Vehicles.Dtos;
using CarSalesCrm.Application.Vehicles.Validators;
using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.UnitTests.Validators;

public class VehicleValidatorsTests
{
    private readonly CreateVehicleRequestValidator _createValidator = new();
    private readonly UpdateVehicleRequestValidator _updateValidator = new();

    [Fact]
    public async Task Create_Should_Fail_When_Brand_Empty()
    {
        var request = new CreateVehicleRequest("", "Gol", 2020, 50000, "Prata", 1000, VehicleType.Hatch, VehicleStatus.Disponivel);
        var result = await _createValidator.ValidateAsync(request);
        Assert.False(result.IsValid);
    }

    [Fact]
    public async Task Create_Should_Succeed_With_Valid_Data()
    {
        var request = new CreateVehicleRequest("Volkswagen", "Gol", 2020, 50000, "Prata", 1000, VehicleType.Hatch, VehicleStatus.Disponivel);
        var result = await _createValidator.ValidateAsync(request);
        Assert.True(result.IsValid);
    }

    [Fact]
    public async Task Update_Should_Fail_When_Price_Invalid()
    {
        var request = new UpdateVehicleRequest("Volkswagen", "Gol", 2020, 0, "Prata", 1000, VehicleType.Hatch, VehicleStatus.Disponivel);
        var result = await _updateValidator.ValidateAsync(request);
        Assert.False(result.IsValid);
    }
}
