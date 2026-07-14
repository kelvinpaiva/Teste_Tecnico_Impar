using CarSalesCrm.Application.Common.Interfaces;
using CarSalesCrm.Application.Common.Results;
using CarSalesCrm.Application.Dashboard.Dtos;
using Microsoft.EntityFrameworkCore;

namespace CarSalesCrm.Application.Dashboard.Services;

public interface IDashboardService
{
    Task<Result<DashboardResponse>> GetAsync(CancellationToken cancellationToken);
}

public class DashboardService : IDashboardService
{
    private readonly IApplicationDbContext _context;

    public DashboardService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<DashboardResponse>> GetAsync(CancellationToken cancellationToken)
    {
        var totalVehicles = await _context.Vehicles.AsNoTracking().CountAsync(cancellationToken);
        var totalCustomers = await _context.Customers.AsNoTracking().CountAsync(cancellationToken);
        var totalOpportunities = await _context.Opportunities.AsNoTracking().CountAsync(cancellationToken);

        var vehiclesByStatus = await _context.Vehicles
            .AsNoTracking()
            .GroupBy(v => v.Status)
            .Select(g => new StatusCountItem(g.Key.ToString(), g.Count()))
            .ToListAsync(cancellationToken);

        var opportunitiesByStatus = await _context.Opportunities
            .AsNoTracking()
            .GroupBy(o => o.Status)
            .Select(g => new StatusCountItem(g.Key.ToString(), g.Count()))
            .ToListAsync(cancellationToken);

        var response = new DashboardResponse(
            totalVehicles,
            totalCustomers,
            totalOpportunities,
            vehiclesByStatus,
            opportunitiesByStatus);

        return Result<DashboardResponse>.Success(response);
    }
}
