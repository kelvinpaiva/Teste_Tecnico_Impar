using CarSalesCrm.Application.Customers.Dtos;
using CarSalesCrm.Application.Customers.Validators;
using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.UnitTests.Validators;

public class CustomerValidatorsTests
{
    private readonly CreateCustomerRequestValidator _validator = new();

    [Fact]
    public async Task Create_Should_Fail_When_Email_Invalid()
    {
        var request = new CreateCustomerRequest("Ana", "email-invalido", "11999999999", CustomerInterest.SUV);
        var result = await _validator.ValidateAsync(request);
        Assert.False(result.IsValid);
    }

    [Fact]
    public async Task Create_Should_Succeed_With_Valid_Data()
    {
        var request = new CreateCustomerRequest("Ana", "ana@email.com", "11999999999", CustomerInterest.SUV);
        var result = await _validator.ValidateAsync(request);
        Assert.True(result.IsValid);
    }
}
