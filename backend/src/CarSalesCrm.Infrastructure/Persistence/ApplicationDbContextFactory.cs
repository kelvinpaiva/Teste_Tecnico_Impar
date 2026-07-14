using CarSalesCrm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CarSalesCrm.Infrastructure.Persistence;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(
            "Server=localhost,1433;Database=CarSalesCrm;User Id=sa;Password=Your_strong_Password123;TrustServerCertificate=True;Encrypt=False");

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
