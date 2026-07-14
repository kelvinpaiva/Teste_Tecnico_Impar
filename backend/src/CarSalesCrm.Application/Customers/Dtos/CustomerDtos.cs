using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.Application.Customers.Dtos;

public record CreateCustomerRequest(
    string Name,
    string Email,
    string Phone,
    CustomerInterest PrimaryInterest);

public record UpdateCustomerRequest(
    string Name,
    string Email,
    string Phone,
    CustomerInterest PrimaryInterest);

public record CustomerResponse(
    Guid Id,
    string Name,
    string Email,
    string Phone,
    CustomerInterest PrimaryInterest,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime LastModifiedAt,
    bool HasQuickOpportunity,
    Guid? QuickOpportunityVehicleId);

public record CustomerOpportunitySummary(
    Guid Id,
    Guid VehicleId,
    string VehicleBrand,
    string VehicleModel,
    OpportunityStatus Status,
    decimal ProposedValue);

public record CustomerDetailsResponse(
    Guid Id,
    string Name,
    string Email,
    string Phone,
    CustomerInterest PrimaryInterest,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime LastModifiedAt,
    bool HasQuickOpportunity,
    Guid? QuickOpportunityVehicleId,
    IReadOnlyList<CustomerOpportunitySummary> Opportunities);

public class CustomerFilter : Common.Models.PagedFilter
{
    public string? Search { get; set; }
    public CustomerInterest? Interest { get; set; }
}
