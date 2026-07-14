using CarSalesCrm.Api.Extensions;
using CarSalesCrm.Application.Opportunities.Dtos;
using CarSalesCrm.Application.Opportunities.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarSalesCrm.Api.Controllers;

[ApiController]
[Route("api/opportunities")]
public class OpportunitiesController : ControllerBase
{
    private readonly IOpportunityService _opportunityService;

    public OpportunitiesController(IOpportunityService opportunityService)
    {
        _opportunityService = opportunityService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] OpportunityFilter filter, CancellationToken cancellationToken)
    {
        var result = await _opportunityService.GetAsync(filter, cancellationToken);
        return result.ToActionResult();
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _opportunityService.GetByIdAsync(id, cancellationToken);
        return result.ToActionResult();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOpportunityRequest request, CancellationToken cancellationToken)
    {
        var result = await _opportunityService.CreateAsync(request, cancellationToken);
        return result.ToActionResult(StatusCodes.Status201Created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOpportunityRequest request, CancellationToken cancellationToken)
    {
        var result = await _opportunityService.UpdateAsync(id, request, cancellationToken);
        return result.ToActionResult();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _opportunityService.DeleteAsync(id, cancellationToken);
        return result.ToActionResult();
    }
}
