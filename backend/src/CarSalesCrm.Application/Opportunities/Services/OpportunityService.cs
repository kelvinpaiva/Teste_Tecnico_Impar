using AutoMapper;
using CarSalesCrm.Application.Common.Interfaces;
using CarSalesCrm.Application.Common.Models;
using CarSalesCrm.Application.Common.Results;
using CarSalesCrm.Application.Opportunities.Dtos;
using CarSalesCrm.Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CarSalesCrm.Application.Opportunities.Services;

public interface IOpportunityService
{
    Task<Result<PagedResponse<OpportunityResponse>>> GetAsync(OpportunityFilter filter, CancellationToken cancellationToken);
    Task<Result<OpportunityDetailsResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<OpportunityResponse>> CreateAsync(CreateOpportunityRequest request, CancellationToken cancellationToken);
    Task<Result<OpportunityResponse>> UpdateAsync(Guid id, UpdateOpportunityRequest request, CancellationToken cancellationToken);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public class OpportunityService : IOpportunityService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateOpportunityRequest> _createValidator;
    private readonly IValidator<UpdateOpportunityRequest> _updateValidator;
    private readonly ILogger<OpportunityService> _logger;

    public OpportunityService(
        IApplicationDbContext context,
        IMapper mapper,
        IValidator<CreateOpportunityRequest> createValidator,
        IValidator<UpdateOpportunityRequest> updateValidator,
        ILogger<OpportunityService> logger)
    {
        _context = context;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    public async Task<Result<PagedResponse<OpportunityResponse>>> GetAsync(
        OpportunityFilter filter,
        CancellationToken cancellationToken)
    {
        var query = _context.Opportunities
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Vehicle)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim().ToLower();
            query = query.Where(o =>
                o.Customer.Name.ToLower().Contains(search) ||
                o.Vehicle.Brand.ToLower().Contains(search) ||
                o.Vehicle.Model.ToLower().Contains(search) ||
                (o.Notes != null && o.Notes.ToLower().Contains(search)));
        }

        if (filter.Status.HasValue)
            query = query.Where(o => o.Status == filter.Status);

        if (filter.CustomerId.HasValue)
            query = query.Where(o => o.CustomerId == filter.CustomerId);

        if (filter.VehicleId.HasValue)
            query = query.Where(o => o.VehicleId == filter.VehicleId);

        query = ApplySorting(query, filter.SortBy, filter.SortDirection);

        var totalItems = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync(cancellationToken);

        var response = PagedResponse<OpportunityResponse>.Create(
            _mapper.Map<List<OpportunityResponse>>(items),
            filter.Page,
            filter.PageSize,
            totalItems);

        return Result<PagedResponse<OpportunityResponse>>.Success(response);
    }

    public async Task<Result<OpportunityDetailsResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var opportunity = await _context.Opportunities
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Vehicle)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (opportunity is null)
            return Result<OpportunityDetailsResponse>.NotFound("Oportunidade não encontrada.");

        return Result<OpportunityDetailsResponse>.Success(_mapper.Map<OpportunityDetailsResponse>(opportunity));
    }

    public async Task<Result<OpportunityResponse>> CreateAsync(
        CreateOpportunityRequest request,
        CancellationToken cancellationToken)
    {
        var validation = await _createValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Result<OpportunityResponse>.ValidationError(
                "Dados inválidos.",
                validation.Errors.Select(e => e.ErrorMessage));
        }

        var referencesResult = await ValidateReferencesAsync(request.CustomerId, request.VehicleId, cancellationToken);
        if (!referencesResult.IsSuccess)
            return Result<OpportunityResponse>.NotFound(referencesResult.Message);

        var now = DateTime.UtcNow;
        var opportunity = _mapper.Map<Opportunity>(request);
        opportunity.Id = Guid.NewGuid();
        opportunity.CreatedAt = now;
        opportunity.UpdatedAt = now;

        _context.Opportunities.Add(opportunity);
        await _context.SaveChangesAsync(cancellationToken);

        var created = await _context.Opportunities
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Vehicle)
            .FirstAsync(o => o.Id == opportunity.Id, cancellationToken);

        _logger.LogInformation("Oportunidade {OpportunityId} criada.", opportunity.Id);
        return Result<OpportunityResponse>.Success(
            _mapper.Map<OpportunityResponse>(created),
            "Oportunidade cadastrada com sucesso.");
    }

    public async Task<Result<OpportunityResponse>> UpdateAsync(
        Guid id,
        UpdateOpportunityRequest request,
        CancellationToken cancellationToken)
    {
        var validation = await _updateValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Result<OpportunityResponse>.ValidationError(
                "Dados inválidos.",
                validation.Errors.Select(e => e.ErrorMessage));
        }

        var opportunity = await _context.Opportunities.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (opportunity is null)
            return Result<OpportunityResponse>.NotFound("Oportunidade não encontrada.");

        var referencesResult = await ValidateReferencesAsync(request.CustomerId, request.VehicleId, cancellationToken);
        if (!referencesResult.IsSuccess)
            return Result<OpportunityResponse>.NotFound(referencesResult.Message);

        _mapper.Map(request, opportunity);
        opportunity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var updated = await _context.Opportunities
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Vehicle)
            .FirstAsync(o => o.Id == id, cancellationToken);

        _logger.LogInformation("Oportunidade {OpportunityId} atualizada.", id);
        return Result<OpportunityResponse>.Success(
            _mapper.Map<OpportunityResponse>(updated),
            "Oportunidade atualizada com sucesso.");
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var opportunity = await _context.Opportunities.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (opportunity is null)
            return Result.NotFound("Oportunidade não encontrada.");

        _context.Opportunities.Remove(opportunity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Oportunidade {OpportunityId} excluída.", id);
        return Result.Success("Oportunidade removida com sucesso.");
    }

    private async Task<Result> ValidateReferencesAsync(
        Guid customerId,
        Guid vehicleId,
        CancellationToken cancellationToken)
    {
        var customerExists = await _context.Customers
            .AsNoTracking()
            .AnyAsync(c => c.Id == customerId, cancellationToken);

        if (!customerExists)
            return Result.NotFound("Cliente informado não foi encontrado.");

        var vehicleExists = await _context.Vehicles
            .AsNoTracking()
            .AnyAsync(v => v.Id == vehicleId, cancellationToken);

        if (!vehicleExists)
            return Result.NotFound("Veículo informado não foi encontrado.");

        return Result.Success();
    }

    private static IQueryable<Opportunity> ApplySorting(
        IQueryable<Opportunity> query,
        string? sortBy,
        string sortDirection)
    {
        var descending = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        return (sortBy?.ToLowerInvariant()) switch
        {
            "status" => descending ? query.OrderByDescending(o => o.Status) : query.OrderBy(o => o.Status),
            "proposedvalue" => descending
                ? query.OrderByDescending(o => o.ProposedValue)
                : query.OrderBy(o => o.ProposedValue),
            "customer" => descending
                ? query.OrderByDescending(o => o.Customer.Name)
                : query.OrderBy(o => o.Customer.Name),
            "vehicle" => descending
                ? query.OrderByDescending(o => o.Vehicle.Brand)
                : query.OrderBy(o => o.Vehicle.Brand),
            "lastmodifiedat" or "updatedat" or "createdat" => descending
                ? query.OrderByDescending(o => o.UpdatedAt ?? o.CreatedAt)
                : query.OrderBy(o => o.UpdatedAt ?? o.CreatedAt),
            _ => query.OrderByDescending(o => o.UpdatedAt ?? o.CreatedAt)
        };
    }
}
