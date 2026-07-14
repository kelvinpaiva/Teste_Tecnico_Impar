using CarSalesCrm.Domain.Entities;
using CarSalesCrm.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CarSalesCrm.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger, CancellationToken cancellationToken = default)
    {
        if (await context.Vehicles.AnyAsync(cancellationToken))
        {
            logger.LogInformation("Seed ignorado: banco já possui dados.");
            return;
        }

        var now = DateTime.UtcNow;

        var vehicles = new List<Vehicle>
        {
            CreateVehicle("Volkswagen", "Gol", 2020, 48900m, "Prata", 42000, VehicleType.Hatch, VehicleStatus.Disponivel, now.AddDays(-20)),
            CreateVehicle("Volkswagen", "T-Cross", 2023, 118900m, "Branco", 15000, VehicleType.SUV, VehicleStatus.Disponivel, now.AddDays(-19)),
            CreateVehicle("Chevrolet", "Onix", 2022, 72900m, "Preto", 28000, VehicleType.Hatch, VehicleStatus.Disponivel, now.AddDays(-18)),
            CreateVehicle("Chevrolet", "Tracker", 2021, 109900m, "Cinza", 35000, VehicleType.SUV, VehicleStatus.Reservado, now.AddDays(-17)),
            CreateVehicle("Fiat", "Argo", 2019, 55900m, "Vermelho", 51000, VehicleType.Hatch, VehicleStatus.Disponivel, now.AddDays(-16)),
            CreateVehicle("Fiat", "Pulse", 2024, 98900m, "Azul", 0, VehicleType.SUV, VehicleStatus.Disponivel, now.AddDays(-15)),
            CreateVehicle("Fiat", "Toro", 2020, 119900m, "Branco", 48000, VehicleType.Utilitario, VehicleStatus.Vendido, now.AddDays(-14)),
            CreateVehicle("Toyota", "Corolla", 2022, 139900m, "Prata", 22000, VehicleType.Sedan, VehicleStatus.Disponivel, now.AddDays(-13)),
            CreateVehicle("Toyota", "Hilux", 2021, 229900m, "Preto", 40000, VehicleType.Utilitario, VehicleStatus.Reservado, now.AddDays(-12)),
            CreateVehicle("Honda", "Civic", 2018, 97900m, "Cinza", 67000, VehicleType.Sedan, VehicleStatus.Disponivel, now.AddDays(-11)),
            CreateVehicle("Honda", "HR-V", 2023, 149900m, "Branco", 9000, VehicleType.SUV, VehicleStatus.Disponivel, now.AddDays(-10)),
            CreateVehicle("Hyundai", "HB20", 2021, 69900m, "Azul", 33000, VehicleType.Hatch, VehicleStatus.Disponivel, now.AddDays(-9)),
            CreateVehicle("Hyundai", "Creta", 2022, 124900m, "Preto", 18000, VehicleType.SUV, VehicleStatus.Reservado, now.AddDays(-8)),
            CreateVehicle("Jeep", "Compass", 2020, 139900m, "Verde", 45000, VehicleType.SUV, VehicleStatus.Disponivel, now.AddDays(-7)),
            CreateVehicle("Jeep", "Renegade", 2019, 94900m, "Laranja", 58000, VehicleType.SUV, VehicleStatus.Vendido, now.AddDays(-6)),
            CreateVehicle("Renault", "Kwid", 2024, 52900m, "Branco", 0, VehicleType.Hatch, VehicleStatus.Disponivel, now.AddDays(-5)),
            CreateVehicle("Nissan", "Kicks", 2021, 98900m, "Prata", 36000, VehicleType.SUV, VehicleStatus.Disponivel, now.AddDays(-4)),
            CreateVehicle("Ford", "Ranger", 2020, 189900m, "Azul", 52000, VehicleType.Utilitario, VehicleStatus.Disponivel, now.AddDays(-3)),
            CreateVehicle("BMW", "320i", 2019, 189900m, "Preto", 41000, VehicleType.Sedan, VehicleStatus.Disponivel, now.AddDays(-2)),
            CreateVehicle("Toyota", "Yaris Sedan", 2024, 112900m, "Branco", 0, VehicleType.Sedan, VehicleStatus.Disponivel, now.AddDays(-1))
        };

        var customers = new List<Customer>
        {
            CreateCustomer("Ana Souza", "ana.souza@email.com", "(11) 98888-1001", CustomerInterest.SUV, now.AddDays(-15)),
            CreateCustomer("Bruno Lima", "bruno.lima@email.com", "(11) 98888-1002", CustomerInterest.Sedan, now.AddDays(-14)),
            CreateCustomer("Carla Mendes", "carla.mendes@email.com", "(21) 97777-2001", CustomerInterest.Hatch, now.AddDays(-13)),
            CreateCustomer("Diego Rocha", "diego.rocha@email.com", "(21) 97777-2002", CustomerInterest.Utilitario, now.AddDays(-12)),
            CreateCustomer("Elena Castro", "elena.castro@email.com", "(31) 96666-3001", CustomerInterest.CarroZero, now.AddDays(-11)),
            CreateCustomer("Felipe Nunes", "felipe.nunes@email.com", "(31) 96666-3002", CustomerInterest.CarroUsado, now.AddDays(-10)),
            CreateCustomer("Gabriela Alves", "gabriela.alves@email.com", "(41) 95555-4001", CustomerInterest.SUV, now.AddDays(-9)),
            CreateCustomer("Henrique Dias", "henrique.dias@email.com", "(41) 95555-4002", CustomerInterest.Sedan, now.AddDays(-8)),
            CreateCustomer("Isabela Freitas", "isabela.freitas@email.com", "(51) 94444-5001", CustomerInterest.Hatch, now.AddDays(-7)),
            CreateCustomer("João Pedro Martins", "joao.martins@email.com", "(51) 94444-5002", CustomerInterest.Utilitario, now.AddDays(-6)),
            CreateCustomer("Karina Oliveira", "karina.oliveira@email.com", "(61) 93333-6001", CustomerInterest.SUV, now.AddDays(-5)),
            CreateCustomer("Lucas Ferreira", "lucas.ferreira@email.com", "(61) 93333-6002", CustomerInterest.CarroUsado, now.AddDays(-4)),
            CreateCustomer("Mariana Costa", "mariana.costa@email.com", "(71) 92222-7001", CustomerInterest.CarroZero, now.AddDays(-3)),
            CreateCustomer("Nicolas Barbosa", "nicolas.barbosa@email.com", "(71) 92222-7002", CustomerInterest.Sedan, now.AddDays(-2)),
            CreateCustomer("Olivia Ramos", "olivia.ramos@email.com", "(85) 91111-8001", CustomerInterest.SUV, now.AddDays(-1))
        };

        context.Vehicles.AddRange(vehicles);
        context.Customers.AddRange(customers);
        await context.SaveChangesAsync(cancellationToken);

        var statuses = new[]
        {
            OpportunityStatus.NovoLead,
            OpportunityStatus.EmNegociacao,
            OpportunityStatus.PropostaEnviada,
            OpportunityStatus.Vendido,
            OpportunityStatus.Perdido
        };

        var opportunities = new List<Opportunity>();
        for (var i = 0; i < 25; i++)
        {
            var customer = customers[i % customers.Count];
            var vehicle = vehicles[i % vehicles.Count];
            var status = statuses[i % statuses.Length];
            var proposed = Math.Round(vehicle.Price * (0.9m + (i % 5) * 0.02m), 2);
            var createdAt = now.AddDays(-i);

            opportunities.Add(new Opportunity
            {
                Id = Guid.NewGuid(),
                CustomerId = customer.Id,
                VehicleId = vehicle.Id,
                Status = status,
                ProposedValue = proposed,
                Notes = $"Negociação seed #{i + 1} - interesse em {vehicle.Brand} {vehicle.Model}.",
                CreatedAt = createdAt,
                UpdatedAt = createdAt
            });
        }

        context.Opportunities.AddRange(opportunities);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation(
            "Seed concluído: {Vehicles} veículos, {Customers} clientes, {Opportunities} oportunidades.",
            vehicles.Count,
            customers.Count,
            opportunities.Count);
    }

    private static Vehicle CreateVehicle(
        string brand,
        string model,
        int year,
        decimal price,
        string color,
        int mileage,
        VehicleType type,
        VehicleStatus status,
        DateTime createdAt) =>
        new()
        {
            Id = Guid.NewGuid(),
            Brand = brand,
            Model = model,
            Year = year,
            Price = price,
            Color = color,
            Mileage = mileage,
            Type = type,
            Status = status,
            CreatedAt = createdAt,
            UpdatedAt = createdAt
        };

    private static Customer CreateCustomer(
        string name,
        string email,
        string phone,
        CustomerInterest interest,
        DateTime createdAt) =>
        new()
        {
            Id = Guid.NewGuid(),
            Name = name,
            Email = email,
            Phone = phone,
            PrimaryInterest = interest,
            CreatedAt = createdAt,
            UpdatedAt = createdAt
        };
}
