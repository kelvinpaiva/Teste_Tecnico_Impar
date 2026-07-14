using CarSalesCrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarSalesCrm.Infrastructure.Persistence.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ToTable("Vehicles");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Brand).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Model).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Color).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Price).HasPrecision(18, 2);
        builder.Property(x => x.Type).HasConversion<int>();
        builder.Property(x => x.Status).HasConversion<int>();

        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Type);
        builder.HasIndex(x => x.Brand);
        builder.HasIndex(x => x.UpdatedAt);
        builder.HasIndex(x => x.CreatedAt);
    }
}
