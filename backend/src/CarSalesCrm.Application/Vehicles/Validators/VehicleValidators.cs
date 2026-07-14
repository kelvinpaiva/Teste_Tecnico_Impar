using CarSalesCrm.Application.Vehicles.Dtos;
using FluentValidation;

namespace CarSalesCrm.Application.Vehicles.Validators;

public class CreateVehicleRequestValidator : AbstractValidator<CreateVehicleRequest>
{
    public CreateVehicleRequestValidator()
    {
        RuleFor(x => x.Brand).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Model).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Year).InclusiveBetween(1950, DateTime.UtcNow.Year + 1);
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Color).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Mileage).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.Status).IsInEnum();
    }
}

public class UpdateVehicleRequestValidator : AbstractValidator<UpdateVehicleRequest>
{
    public UpdateVehicleRequestValidator()
    {
        RuleFor(x => x.Brand).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Model).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Year).InclusiveBetween(1950, DateTime.UtcNow.Year + 1);
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Color).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Mileage).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.Status).IsInEnum();
    }
}
