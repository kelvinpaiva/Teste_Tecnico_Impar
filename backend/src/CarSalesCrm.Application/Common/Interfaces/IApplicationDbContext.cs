using CarSalesCrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CarSalesCrm.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Vehicle> Vehicles { get; }
    DbSet<Customer> Customers { get; }
    DbSet<Opportunity> Opportunities { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
