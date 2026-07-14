using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarSalesCrm.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddVehicleType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Vehicles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_CreatedAt",
                table: "Vehicles",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_Type",
                table: "Vehicles",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_UpdatedAt",
                table: "Vehicles",
                column: "UpdatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Vehicles_CreatedAt",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_Type",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_UpdatedAt",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Vehicles");
        }
    }
}
