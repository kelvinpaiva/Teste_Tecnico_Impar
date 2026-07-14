using AutoMapper;
using CarSalesCrm.Application.Common.Interfaces;
using CarSalesCrm.Application.Common.Models;
using CarSalesCrm.Application.Common.Results;
using CarSalesCrm.Application.Vehicles.Dtos;
using CarSalesCrm.Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CarSalesCrm.Application.Vehicles.Services;

public interface IVehicleService
{
    Task<Result<PagedResponse<VehicleResponse>>> GetAsync(VehicleFilter filter, CancellationToken cancellationToken);
    Task<Result<VehicleDetailsResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<VehicleResponse>> CreateAsync(CreateVehicleRequest request, CancellationToken cancellationToken);
    Task<Result<VehicleResponse>> UpdateAsync(Guid id, UpdateVehicleRequest request, CancellationToken cancellationToken);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public class VehicleService : IVehicleService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateVehicleRequest> _createValidator;
    private readonly IValidator<UpdateVehicleRequest> _updateValidator;
    private readonly ILogger<VehicleService> _logger;

    public VehicleService(
        IApplicationDbContext context,
        IMapper mapper,
        IValidator<CreateVehicleRequest> createValidator,
        IValidator<UpdateVehicleRequest> updateValidator,
        ILogger<VehicleService> logger)
    {
        _context = context;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    public async Task<Result<PagedResponse<VehicleResponse>>> GetAsync(
        VehicleFilter filter,
        CancellationToken cancellationToken)
    {
        var query = _context.Vehicles.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim().ToLower();
            query = query.Where(v =>
                v.Brand.ToLower().Contains(search) ||
                v.Model.ToLower().Contains(search) ||
                v.Color.ToLower().Contains(search));
        }

        if (filter.Status.HasValue)
            query = query.Where(v => v.Status == filter.Status);

        if (filter.Type.HasValue)
            query = query.Where(v => v.Type == filter.Type);

        if (!string.IsNullOrWhiteSpace(filter.Brand))
            query = query.Where(v => v.Brand.ToLower().Contains(filter.Brand.Trim().ToLower()));

        if (filter.Year.HasValue)
            query = query.Where(v => v.Year == filter.Year);

        query = ApplySorting(query, filter.SortBy, filter.SortDirection);

        var totalItems = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync(cancellationToken);

        var response = PagedResponse<VehicleResponse>.Create(
            _mapper.Map<List<VehicleResponse>>(items),
            filter.Page,
            filter.PageSize,
            totalItems);

        return Result<PagedResponse<VehicleResponse>>.Success(response);
    }

    public async Task<Result<VehicleDetailsResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .AsNoTracking()
            .Include(v => v.Opportunities)
            .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);

        if (vehicle is null)
            return Result<VehicleDetailsResponse>.NotFound("Veículo não encontrado.");

        return Result<VehicleDetailsResponse>.Success(_mapper.Map<VehicleDetailsResponse>(vehicle));
    }

    public async Task<Result<VehicleResponse>> CreateAsync(
        CreateVehicleRequest request,
        CancellationToken cancellationToken)
    {
        var validation = await _createValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Result<VehicleResponse>.ValidationError(
                "Dados inválidos.",
                validation.Errors.Select(e => e.ErrorMessage));
        }

        var now = DateTime.UtcNow;
        var vehicle = _mapper.Map<Vehicle>(request);
        vehicle.Id = Guid.NewGuid();
        vehicle.CreatedAt = now;
        vehicle.UpdatedAt = now;

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Veículo {VehicleId} criado.", vehicle.Id);
        return Result<VehicleResponse>.Success(_mapper.Map<VehicleResponse>(vehicle), "Veículo cadastrado com sucesso.");
    }

    public async Task<Result<VehicleResponse>> UpdateAsync(
        Guid id,
        UpdateVehicleRequest request,
        CancellationToken cancellationToken)
    {
        var validation = await _updateValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Result<VehicleResponse>.ValidationError(
                "Dados inválidos.",
                validation.Errors.Select(e => e.ErrorMessage));
        }

        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
        if (vehicle is null)
            return Result<VehicleResponse>.NotFound("Veículo não encontrado.");

        _mapper.Map(request, vehicle);
        vehicle.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Veículo {VehicleId} atualizado.", vehicle.Id);
        return Result<VehicleResponse>.Success(_mapper.Map<VehicleResponse>(vehicle), "Veículo atualizado com sucesso.");
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
        if (vehicle is null)
            return Result.NotFound("Veículo não encontrado.");

        var hasOpportunities = await _context.Opportunities
            .AnyAsync(o => o.VehicleId == id, cancellationToken);

        if (hasOpportunities)
        {
            return Result.Conflict(
                "Não é possível excluir o veículo porque existem oportunidades associadas.");
        }

        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Veículo {VehicleId} excluído.", id);
        return Result.Success("Veículo removido com sucesso.");
    }

    private static IQueryable<Vehicle> ApplySorting(IQueryable<Vehicle> query, string? sortBy, string sortDirection)
    {
        var descending = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        return (sortBy?.ToLowerInvariant()) switch
        {
            "brand" => descending ? query.OrderByDescending(v => v.Brand) : query.OrderBy(v => v.Brand),
            "model" => descending ? query.OrderByDescending(v => v.Model) : query.OrderBy(v => v.Model),
            "year" => descending ? query.OrderByDescending(v => v.Year) : query.OrderBy(v => v.Year),
            "price" => descending ? query.OrderByDescending(v => v.Price) : query.OrderBy(v => v.Price),
            "mileage" => descending ? query.OrderByDescending(v => v.Mileage) : query.OrderBy(v => v.Mileage),
            "type" => descending ? query.OrderByDescending(v => v.Type) : query.OrderBy(v => v.Type),
            "status" => descending ? query.OrderByDescending(v => v.Status) : query.OrderBy(v => v.Status),
            "lastmodifiedat" or "updatedat" or "createdat" => descending
                ? query.OrderByDescending(v => v.UpdatedAt ?? v.CreatedAt)
                : query.OrderBy(v => v.UpdatedAt ?? v.CreatedAt),
            _ => query.OrderByDescending(v => v.UpdatedAt ?? v.CreatedAt)
        };
    }
}
