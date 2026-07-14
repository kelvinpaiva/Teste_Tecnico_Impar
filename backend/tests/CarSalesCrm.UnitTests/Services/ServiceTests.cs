using AutoMapper;
using CarSalesCrm.Application.Common.Mappings;
using CarSalesCrm.Application.Common.Results;
using CarSalesCrm.Application.Customers.Dtos;
using CarSalesCrm.Application.Customers.Services;
using CarSalesCrm.Application.Customers.Validators;
using CarSalesCrm.Application.Opportunities.Dtos;
using CarSalesCrm.Application.Opportunities.Services;
using CarSalesCrm.Application.Opportunities.Validators;
using CarSalesCrm.Application.Vehicles.Dtos;
using CarSalesCrm.Application.Vehicles.Services;
using CarSalesCrm.Application.Vehicles.Validators;
using CarSalesCrm.Domain.Entities;
using CarSalesCrm.Domain.Enums;
using CarSalesCrm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace CarSalesCrm.UnitTests.Services;

public class VehicleServiceTests
{
    private static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    private static IMapper CreateMapper()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        return config.CreateMapper();
    }

    [Fact]
    public async Task Create_Should_Persist_Vehicle()
    {
        await using var context = CreateContext();
        var service = new VehicleService(
            context,
            CreateMapper(),
            new CreateVehicleRequestValidator(),
            new UpdateVehicleRequestValidator(),
            NullLogger<VehicleService>.Instance);

        var result = await service.CreateAsync(
            new CreateVehicleRequest("VW", "Gol", 2020, 45000, "Prata", 10000, VehicleType.Hatch, VehicleStatus.Disponivel),
            CancellationToken.None);

        Assert.Equal(ResultStatus.Success, result.Status);
        Assert.Equal(1, await context.Vehicles.CountAsync());
    }

    [Fact]
    public async Task Delete_Should_Return_Conflict_When_Has_Opportunities()
    {
        await using var context = CreateContext();
        var vehicleId = Guid.NewGuid();
        var customerId = Guid.NewGuid();

        context.Vehicles.Add(new Vehicle
        {
            Id = vehicleId,
            Brand = "VW",
            Model = "Gol",
            Year = 2020,
            Price = 40000,
            Color = "Prata",
            Mileage = 1000,
            Type = VehicleType.Hatch,
            Status = VehicleStatus.Disponivel,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        context.Customers.Add(new Customer
        {
            Id = customerId,
            Name = "Ana",
            Email = "ana@test.com",
            Phone = "11999999999",
            PrimaryInterest = CustomerInterest.Hatch,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        context.Opportunities.Add(new Opportunity
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            VehicleId = vehicleId,
            Status = OpportunityStatus.NovoLead,
            ProposedValue = 39000,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var service = new VehicleService(
            context,
            CreateMapper(),
            new CreateVehicleRequestValidator(),
            new UpdateVehicleRequestValidator(),
            NullLogger<VehicleService>.Instance);

        var result = await service.DeleteAsync(vehicleId, CancellationToken.None);

        Assert.Equal(ResultStatus.Conflict, result.Status);
        Assert.Equal(1, await context.Vehicles.CountAsync());
    }
}

public class CustomerServiceTests
{
    private static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    private static IMapper CreateMapper()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        return config.CreateMapper();
    }

    [Fact]
    public async Task Create_Should_Return_Conflict_When_Email_Duplicated()
    {
        await using var context = CreateContext();
        context.Customers.Add(new Customer
        {
            Id = Guid.NewGuid(),
            Name = "Ana",
            Email = "ana@test.com",
            Phone = "11999999999",
            PrimaryInterest = CustomerInterest.SUV,
            CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var service = new CustomerService(
            context,
            CreateMapper(),
            new CreateCustomerRequestValidator(),
            new UpdateCustomerRequestValidator(),
            NullLogger<CustomerService>.Instance);

        var result = await service.CreateAsync(
            new CreateCustomerRequest("Outra", "ana@test.com", "11888888888", CustomerInterest.Sedan),
            CancellationToken.None);

        Assert.Equal(ResultStatus.Conflict, result.Status);
    }
}

public class OpportunityServiceTests
{
    private static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    private static IMapper CreateMapper()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        return config.CreateMapper();
    }

    [Fact]
    public async Task Create_Should_Return_NotFound_When_Customer_Missing()
    {
        await using var context = CreateContext();
        var vehicleId = Guid.NewGuid();
        context.Vehicles.Add(new Vehicle
        {
            Id = vehicleId,
            Brand = "VW",
            Model = "Gol",
            Year = 2020,
            Price = 40000,
            Color = "Prata",
            Mileage = 1000,
            Type = VehicleType.Hatch,
            Status = VehicleStatus.Disponivel,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var service = new OpportunityService(
            context,
            CreateMapper(),
            new CreateOpportunityRequestValidator(),
            new UpdateOpportunityRequestValidator(),
            NullLogger<OpportunityService>.Instance);

        var result = await service.CreateAsync(
            new CreateOpportunityRequest(Guid.NewGuid(), vehicleId, OpportunityStatus.NovoLead, 35000, "teste"),
            CancellationToken.None);

        Assert.Equal(ResultStatus.NotFound, result.Status);
    }
}
