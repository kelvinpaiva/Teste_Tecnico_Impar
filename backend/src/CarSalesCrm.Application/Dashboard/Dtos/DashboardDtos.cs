namespace CarSalesCrm.Application.Dashboard.Dtos;

public record StatusCountItem(string Status, int Count);

public record DashboardResponse(
    int TotalVehicles,
    int TotalCustomers,
    int TotalOpportunities,
    IReadOnlyList<StatusCountItem> VehiclesByStatus,
    IReadOnlyList<StatusCountItem> OpportunitiesByStatus);
