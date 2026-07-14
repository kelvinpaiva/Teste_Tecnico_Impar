using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.Application.Vehicles.Dtos;

public record CreateVehicleRequest(
    string Brand,
    string Model,
    int Year,
    decimal Price,
    string Color,
    int Mileage,
    VehicleType Type,
    VehicleStatus Status);

public record UpdateVehicleRequest(
    string Brand,
    string Model,
    int Year,
    decimal Price,
    string Color,
    int Mileage,
    VehicleType Type,
    VehicleStatus Status);

public record VehicleResponse(
    Guid Id,
    string Brand,
    string Model,
    int Year,
    decimal Price,
    string Color,
    int Mileage,
    VehicleType Type,
    VehicleStatus Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime LastModifiedAt);

public record VehicleDetailsResponse(
    Guid Id,
    string Brand,
    string Model,
    int Year,
    decimal Price,
    string Color,
    int Mileage,
    VehicleType Type,
    VehicleStatus Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime LastModifiedAt,
    int OpportunitiesCount);

public class VehicleFilter : Common.Models.PagedFilter
{
    public string? Search { get; set; }
    public VehicleStatus? Status { get; set; }
    public VehicleType? Type { get; set; }
    public string? Brand { get; set; }
    public int? Year { get; set; }
}
