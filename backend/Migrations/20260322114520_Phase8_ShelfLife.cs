using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChemWatch.Migrations
{
    /// <inheritdoc />
    public partial class Phase8_ShelfLife : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "first_inspect_date",
                table: "inventory_lots",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "last_monitor_date",
                table: "inventory_lots",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "next_monitor_date",
                table: "inventory_lots",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "peroxide_status",
                table: "inventory_lots",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "peroxide_tests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    inventory_lot_id = table.Column<Guid>(type: "uuid", nullable: false),
                    test_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    tested_by_user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    test_method = table.Column<string>(type: "text", nullable: true),
                    result_type = table.Column<string>(type: "text", nullable: false),
                    ppm_result = table.Column<decimal>(type: "numeric", nullable: true),
                    result_text = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    classification = table.Column<string>(type: "text", nullable: false),
                    visual_observations = table.Column<string>(type: "text", nullable: true),
                    notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    next_monitor_due = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_peroxide_tests", x => x.id);
                    table.ForeignKey(
                        name: "fk_peroxide_tests_inventory_lots_inventory_lot_id",
                        column: x => x.inventory_lot_id,
                        principalTable: "inventory_lots",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_peroxide_tests_users_tested_by_user_id",
                        column: x => x.tested_by_user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "shelf_life_extensions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    inventory_lot_id = table.Column<Guid>(type: "uuid", nullable: false),
                    extension_number = table.Column<int>(type: "integer", nullable: false),
                    previous_expiry_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    new_expiry_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    previous_days_to_expiry = table.Column<int>(type: "integer", nullable: true),
                    new_days_to_expiry = table.Column<int>(type: "integer", nullable: false),
                    extension_days = table.Column<int>(type: "integer", nullable: false),
                    reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    test_performed = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    test_result = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    test_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    authorized_by_user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_shelf_life_extensions", x => x.id);
                    table.ForeignKey(
                        name: "fk_shelf_life_extensions_inventory_lots_inventory_lot_id",
                        column: x => x.inventory_lot_id,
                        principalTable: "inventory_lots",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_shelf_life_extensions_users_authorized_by_user_id",
                        column: x => x.authorized_by_user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                column: "password_hash",
                value: "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG");

            migrationBuilder.CreateIndex(
                name: "ix_peroxide_tests_inventory_lot_id",
                table: "peroxide_tests",
                column: "inventory_lot_id");

            migrationBuilder.CreateIndex(
                name: "ix_peroxide_tests_test_date",
                table: "peroxide_tests",
                column: "test_date");

            migrationBuilder.CreateIndex(
                name: "ix_peroxide_tests_tested_by_user_id",
                table: "peroxide_tests",
                column: "tested_by_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_shelf_life_extensions_authorized_by_user_id",
                table: "shelf_life_extensions",
                column: "authorized_by_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_shelf_life_extensions_inventory_lot_id",
                table: "shelf_life_extensions",
                column: "inventory_lot_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "peroxide_tests");

            migrationBuilder.DropTable(
                name: "shelf_life_extensions");

            migrationBuilder.DropColumn(
                name: "first_inspect_date",
                table: "inventory_lots");

            migrationBuilder.DropColumn(
                name: "last_monitor_date",
                table: "inventory_lots");

            migrationBuilder.DropColumn(
                name: "next_monitor_date",
                table: "inventory_lots");

            migrationBuilder.DropColumn(
                name: "peroxide_status",
                table: "inventory_lots");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                column: "password_hash",
                value: "$2a$11$oUlgSKiiH8PFFxMbXLVDd.HSCG5mr4V9z4ooOHyhUCJWYTspR4kte");
        }
    }
}
