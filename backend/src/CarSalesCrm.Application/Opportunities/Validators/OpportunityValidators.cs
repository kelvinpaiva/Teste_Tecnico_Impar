using CarSalesCrm.Application.Opportunities.Dtos;
using FluentValidation;

namespace CarSalesCrm.Application.Opportunities.Validators;

public class CreateOpportunityRequestValidator : AbstractValidator<CreateOpportunityRequest>
{
    public CreateOpportunityRequestValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.VehicleId).NotEmpty();
        RuleFor(x => x.Status).IsInEnum();
        RuleFor(x => x.ProposedValue).GreaterThan(0);
        RuleFor(x => x.Notes).MaximumLength(2000);
    }
}

public class UpdateOpportunityRequestValidator : AbstractValidator<UpdateOpportunityRequest>
{
    public UpdateOpportunityRequestValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.VehicleId).NotEmpty();
        RuleFor(x => x.Status).IsInEnum();
        RuleFor(x => x.ProposedValue).GreaterThan(0);
        RuleFor(x => x.Notes).MaximumLength(2000);
    }
}
