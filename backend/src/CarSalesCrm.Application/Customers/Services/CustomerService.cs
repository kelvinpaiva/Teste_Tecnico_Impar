using AutoMapper;
using CarSalesCrm.Application.Common.Helpers;
using CarSalesCrm.Application.Common.Interfaces;
using CarSalesCrm.Application.Common.Models;
using CarSalesCrm.Application.Common.Results;
using CarSalesCrm.Application.Customers.Dtos;
using CarSalesCrm.Domain.Entities;
using CarSalesCrm.Domain.Enums;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CarSalesCrm.Application.Customers.Services;

public interface ICustomerService
{
    Task<Result<PagedResponse<CustomerResponse>>> GetAsync(CustomerFilter filter, CancellationToken cancellationToken);
    Task<Result<CustomerDetailsResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<CustomerResponse>> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken);
    Task<Result<CustomerResponse>> UpdateAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public class CustomerService : ICustomerService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateCustomerRequest> _createValidator;
    private readonly IValidator<UpdateCustomerRequest> _updateValidator;
    private readonly ILogger<CustomerService> _logger;

    public CustomerService(
        IApplicationDbContext context,
        IMapper mapper,
        IValidator<CreateCustomerRequest> createValidator,
        IValidator<UpdateCustomerRequest> updateValidator,
        ILogger<CustomerService> logger)
    {
        _context = context;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    public async Task<Result<PagedResponse<CustomerResponse>>> GetAsync(
        CustomerFilter filter,
        CancellationToken cancellationToken)
    {
        var query = _context.Customers.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim().ToLower();
            query = query.Where(c =>
                c.Name.ToLower().Contains(search) ||
                c.Email.ToLower().Contains(search) ||
                c.Phone.ToLower().Contains(search));
        }

        if (filter.Interest.HasValue)
            query = query.Where(c => c.PrimaryInterest == filter.Interest);

        query = ApplySorting(query, filter.SortBy, filter.SortDirection);

        var totalItems = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync(cancellationToken);

        var availableVehicles = await _context.Vehicles
            .AsNoTracking()
            .Where(v => v.Status == VehicleStatus.Disponivel)
            .ToListAsync(cancellationToken);

        var responseItems = items.Select(customer =>
        {
            var vehicleId = QuickOpportunityMatcher.FindMatchingVehicleId(customer.PrimaryInterest, availableVehicles);
            return new CustomerResponse(
                customer.Id,
                customer.Name,
                customer.Email,
                customer.Phone,
                customer.PrimaryInterest,
                customer.CreatedAt,
                customer.UpdatedAt,
                customer.LastModifiedAt,
                vehicleId.HasValue,
                vehicleId);
        }).ToList();

        var response = PagedResponse<CustomerResponse>.Create(
            responseItems,
            filter.Page,
            filter.PageSize,
            totalItems);

        return Result<PagedResponse<CustomerResponse>>.Success(response);
    }

    public async Task<Result<CustomerDetailsResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .AsNoTracking()
            .Include(c => c.Opportunities)
                .ThenInclude(o => o.Vehicle)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (customer is null)
            return Result<CustomerDetailsResponse>.NotFound("Cliente não encontrado.");

        var availableVehicles = await _context.Vehicles
            .AsNoTracking()
            .Where(v => v.Status == VehicleStatus.Disponivel)
            .ToListAsync(cancellationToken);

        var quickVehicleId = QuickOpportunityMatcher.FindMatchingVehicleId(customer.PrimaryInterest, availableVehicles);

        var details = new CustomerDetailsResponse(
            customer.Id,
            customer.Name,
            customer.Email,
            customer.Phone,
            customer.PrimaryInterest,
            customer.CreatedAt,
            customer.UpdatedAt,
            customer.LastModifiedAt,
            quickVehicleId.HasValue,
            quickVehicleId,
            customer.Opportunities
                .OrderByDescending(o => o.UpdatedAt ?? o.CreatedAt)
                .Select(o => new CustomerOpportunitySummary(
                    o.Id,
                    o.VehicleId,
                    o.Vehicle.Brand,
                    o.Vehicle.Model,
                    o.Status,
                    o.ProposedValue))
                .ToList());

        return Result<CustomerDetailsResponse>.Success(details);
    }

    public async Task<Result<CustomerResponse>> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        var validation = await _createValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Result<CustomerResponse>.ValidationError(
                "Dados inválidos.",
                validation.Errors.Select(e => e.ErrorMessage));
        }

        var emailExists = await _context.Customers
            .AnyAsync(c => c.Email.ToLower() == request.Email.Trim().ToLower(), cancellationToken);

        if (emailExists)
            return Result<CustomerResponse>.Conflict("Já existe um cliente cadastrado com este e-mail.");

        var now = DateTime.UtcNow;
        var customer = _mapper.Map<Customer>(request);
        customer.Id = Guid.NewGuid();
        customer.Email = request.Email.Trim();
        customer.CreatedAt = now;
        customer.UpdatedAt = now;

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync(cancellationToken);

        var availableVehicles = await _context.Vehicles
            .AsNoTracking()
            .Where(v => v.Status == VehicleStatus.Disponivel)
            .ToListAsync(cancellationToken);
        var vehicleId = QuickOpportunityMatcher.FindMatchingVehicleId(customer.PrimaryInterest, availableVehicles);

        _logger.LogInformation("Cliente {CustomerId} criado.", customer.Id);
        return Result<CustomerResponse>.Success(
            new CustomerResponse(
                customer.Id,
                customer.Name,
                customer.Email,
                customer.Phone,
                customer.PrimaryInterest,
                customer.CreatedAt,
                customer.UpdatedAt,
                customer.LastModifiedAt,
                vehicleId.HasValue,
                vehicleId),
            "Cliente cadastrado com sucesso.");
    }

    public async Task<Result<CustomerResponse>> UpdateAsync(
        Guid id,
        UpdateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        var validation = await _updateValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Result<CustomerResponse>.ValidationError(
                "Dados inválidos.",
                validation.Errors.Select(e => e.ErrorMessage));
        }

        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (customer is null)
            return Result<CustomerResponse>.NotFound("Cliente não encontrado.");

        var emailExists = await _context.Customers
            .AnyAsync(c => c.Id != id && c.Email.ToLower() == request.Email.Trim().ToLower(), cancellationToken);

        if (emailExists)
            return Result<CustomerResponse>.Conflict("Já existe um cliente cadastrado com este e-mail.");

        _mapper.Map(request, customer);
        customer.Email = request.Email.Trim();
        customer.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var availableVehicles = await _context.Vehicles
            .AsNoTracking()
            .Where(v => v.Status == VehicleStatus.Disponivel)
            .ToListAsync(cancellationToken);
        var vehicleId = QuickOpportunityMatcher.FindMatchingVehicleId(customer.PrimaryInterest, availableVehicles);

        _logger.LogInformation("Cliente {CustomerId} atualizado.", customer.Id);
        return Result<CustomerResponse>.Success(
            new CustomerResponse(
                customer.Id,
                customer.Name,
                customer.Email,
                customer.Phone,
                customer.PrimaryInterest,
                customer.CreatedAt,
                customer.UpdatedAt,
                customer.LastModifiedAt,
                vehicleId.HasValue,
                vehicleId),
            "Cliente atualizado com sucesso.");
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (customer is null)
            return Result.NotFound("Cliente não encontrado.");

        var hasOpportunities = await _context.Opportunities
            .AnyAsync(o => o.CustomerId == id, cancellationToken);

        if (hasOpportunities)
        {
            return Result.Conflict(
                "Não é possível excluir o cliente porque existem oportunidades associadas.");
        }

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Cliente {CustomerId} excluído.", id);
        return Result.Success("Cliente removido com sucesso.");
    }

    private static IQueryable<Customer> ApplySorting(IQueryable<Customer> query, string? sortBy, string sortDirection)
    {
        var descending = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        return (sortBy?.ToLowerInvariant()) switch
        {
            "name" => descending ? query.OrderByDescending(c => c.Name) : query.OrderBy(c => c.Name),
            "email" => descending ? query.OrderByDescending(c => c.Email) : query.OrderBy(c => c.Email),
            "interest" => descending
                ? query.OrderByDescending(c => c.PrimaryInterest)
                : query.OrderBy(c => c.PrimaryInterest),
            "lastmodifiedat" or "updatedat" or "createdat" => descending
                ? query.OrderByDescending(c => c.UpdatedAt ?? c.CreatedAt)
                : query.OrderBy(c => c.UpdatedAt ?? c.CreatedAt),
            _ => query.OrderByDescending(c => c.UpdatedAt ?? c.CreatedAt)
        };
    }
}
