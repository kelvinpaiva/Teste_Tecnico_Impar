using CarSalesCrm.Application.Common.Results;
using Microsoft.AspNetCore.Mvc;

namespace CarSalesCrm.Api.Extensions;

public static class ResultExtensions
{
    public static IActionResult ToActionResult(this Result result)
    {
        return result.Status switch
        {
            ResultStatus.Success => new NoContentResult(),
            ResultStatus.NotFound => new NotFoundObjectResult(ToError(result)),
            ResultStatus.ValidationError => new BadRequestObjectResult(ToError(result)),
            ResultStatus.Conflict => new ConflictObjectResult(ToError(result)),
            _ => new ObjectResult(ToError(result)) { StatusCode = StatusCodes.Status500InternalServerError }
        };
    }

    public static IActionResult ToActionResult<T>(this Result<T> result, int successStatusCode = StatusCodes.Status200OK)
    {
        if (result.IsSuccess)
        {
            return successStatusCode switch
            {
                StatusCodes.Status201Created => new ObjectResult(result.Data) { StatusCode = StatusCodes.Status201Created },
                StatusCodes.Status204NoContent => new NoContentResult(),
                _ => new OkObjectResult(result.Data)
            };
        }

        return result.Status switch
        {
            ResultStatus.NotFound => new NotFoundObjectResult(ToError(result)),
            ResultStatus.ValidationError => new BadRequestObjectResult(ToError(result)),
            ResultStatus.Conflict => new ConflictObjectResult(ToError(result)),
            _ => new ObjectResult(ToError(result)) { StatusCode = StatusCodes.Status500InternalServerError }
        };
    }

    private static object ToError(Result result) => new
    {
        success = false,
        message = result.Message,
        errors = result.Errors
    };
}
