using CarSalesCrm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarSalesCrm.Infrastructure.Persistence.Configurations;

public class OpportunityConfiguration : IEntityTypeConfiguration<Opportunity>
{
    public void Configure(EntityTypeBuilder<Opportunity> builder)
    {
        builder.ToTable("Opportunities");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ProposedValue).HasPrecision(18, 2);
        builder.Property(x => x.Notes).HasMaxLength(2000);
        builder.Property(x => x.Status).HasConversion<int>();

        builder.HasOne(x => x.Customer)
            .WithMany(c => c.Opportunities)
            .HasForeignKey(x => x.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Vehicle)
            .WithMany(v => v.Opportunities)
            .HasForeignKey(x => x.VehicleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.CustomerId);
        builder.HasIndex(x => x.VehicleId);
    }
}
