using CarSalesCrm.Api.Extensions;
using CarSalesCrm.Application.Vehicles.Dtos;
using CarSalesCrm.Application.Vehicles.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarSalesCrm.Api.Controllers;

[ApiController]
[Route("api/vehicles")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] VehicleFilter filter, CancellationToken cancellationToken)
    {
        var result = await _vehicleService.GetAsync(filter, cancellationToken);
        return result.ToActionResult();
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _vehicleService.GetByIdAsync(id, cancellationToken);
        return result.ToActionResult();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVehicleRequest request, CancellationToken cancellationToken)
    {
        var result = await _vehicleService.CreateAsync(request, cancellationToken);
        return result.ToActionResult(StatusCodes.Status201Created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVehicleRequest request, CancellationToken cancellationToken)
    {
        var result = await _vehicleService.UpdateAsync(id, request, cancellationToken);
        return result.ToActionResult();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _vehicleService.DeleteAsync(id, cancellationToken);
        return result.ToActionResult();
    }
}
