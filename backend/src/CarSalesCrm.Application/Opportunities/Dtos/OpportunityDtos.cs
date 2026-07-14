using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.Application.Opportunities.Dtos;

public record CreateOpportunityRequest(
    Guid CustomerId,
    Guid VehicleId,
    OpportunityStatus Status,
    decimal ProposedValue,
    string? Notes);

public record UpdateOpportunityRequest(
    Guid CustomerId,
    Guid VehicleId,
    OpportunityStatus Status,
    decimal ProposedValue,
    string? Notes);

public record OpportunityResponse(
    Guid Id,
    Guid CustomerId,
    string CustomerName,
    Guid VehicleId,
    string VehicleBrand,
    string VehicleModel,
    OpportunityStatus Status,
    decimal ProposedValue,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime LastModifiedAt);

public record OpportunityDetailsResponse(
    Guid Id,
    Guid CustomerId,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    Guid VehicleId,
    string VehicleBrand,
    string VehicleModel,
    int VehicleYear,
    decimal VehiclePrice,
    OpportunityStatus Status,
    decimal ProposedValue,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime LastModifiedAt);

public class OpportunityFilter : Common.Models.PagedFilter
{
    public string? Search { get; set; }
    public OpportunityStatus? Status { get; set; }
    public Guid? CustomerId { get; set; }
    public Guid? VehicleId { get; set; }
}
