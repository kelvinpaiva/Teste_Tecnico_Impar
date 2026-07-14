using CarSalesCrm.Api.Extensions;
using CarSalesCrm.Application.Dashboard.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarSalesCrm.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetAsync(cancellationToken);
        return result.ToActionResult();
    }
}
