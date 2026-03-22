using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChemWatch.Migrations
{
    /// <inheritdoc />
    public partial class Phase5_PendingDeliveryCheckIn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "quantity_received",
                table: "purchase_request_items",
                type: "numeric(12,3)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "quantity_received",
                table: "purchase_request_items");
        }
    }
}
