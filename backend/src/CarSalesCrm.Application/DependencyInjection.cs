using System.Reflection;
using CarSalesCrm.Application.Customers.Services;
using CarSalesCrm.Application.Dashboard.Services;
using CarSalesCrm.Application.Opportunities.Services;
using CarSalesCrm.Application.Vehicles.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace CarSalesCrm.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(cfg => cfg.AddMaps(Assembly.GetExecutingAssembly()));
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddScoped<IVehicleService, VehicleService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IOpportunityService, OpportunityService>();
        services.AddScoped<IDashboardService, DashboardService>();

        return services;
    }
}
