using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ChemWatch.Migrations
{
    /// <inheritdoc />
    public partial class AddPhase3InventoryCore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "inventory_lots",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    item_id = table.Column<Guid>(type: "uuid", nullable: false),
                    lab_id = table.Column<Guid>(type: "uuid", nullable: false),
                    location_id = table.Column<Guid>(type: "uuid", nullable: false),
                    vendor_id = table.Column<Guid>(type: "uuid", nullable: true),
                    lot_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    quantity_received = table.Column<decimal>(type: "numeric(12,3)", nullable: false),
                    quantity_remaining = table.Column<decimal>(type: "numeric(12,3)", nullable: false),
                    unit = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    manufacture_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    expiry_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    open_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    storage_sublocation = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    source_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    purchase_request_id = table.Column<Guid>(type: "uuid", nullable: true),
                    purchase_request_item_id = table.Column<Guid>(type: "uuid", nullable: true),
                    checked_in_by = table.Column<Guid>(type: "uuid", nullable: false),
                    checked_in_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    qr_code_data = table.Column<string>(type: "jsonb", nullable: true),
                    extension_count = table.Column<int>(type: "integer", nullable: false),
                    version = table.Column<int>(type: "integer", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    manual_source_reason = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    certificate_of_analysis = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    assigned_value = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    uncertainty = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    certifying_body = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_inventory_lots", x => x.id);
                    table.ForeignKey(
                        name: "fk_inventory_lots_items_item_id",
                        column: x => x.item_id,
                        principalTable: "items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_inventory_lots_labs_lab_id",
                        column: x => x.lab_id,
                        principalTable: "labs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_inventory_lots_locations_location_id",
                        column: x => x.location_id,
                        principalTable: "locations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_inventory_lots_users_checked_in_by",
                        column: x => x.checked_in_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_inventory_lots_vendors_vendor_id",
                        column: x => x.vendor_id,
                        principalTable: "vendors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "stock_transactions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    transaction_type = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    lab_id = table.Column<Guid>(type: "uuid", nullable: true),
                    location_id = table.Column<Guid>(type: "uuid", nullable: true),
                    lot_id = table.Column<Guid>(type: "uuid", nullable: true),
                    purchase_request_id = table.Column<Guid>(type: "uuid", nullable: true),
                    item_id = table.Column<Guid>(type: "uuid", nullable: true),
                    quantity = table.Column<decimal>(type: "numeric(12,3)", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    metadata = table.Column<string>(type: "jsonb", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_stock_transactions", x => x.id);
                    table.ForeignKey(
                        name: "fk_stock_transactions_inventory_lots_lot_id",
                        column: x => x.lot_id,
                        principalTable: "inventory_lots",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_stock_transactions_items_item_id",
                        column: x => x.item_id,
                        principalTable: "items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_stock_transactions_labs_lab_id",
                        column: x => x.lab_id,
                        principalTable: "labs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_stock_transactions_locations_location_id",
                        column: x => x.location_id,
                        principalTable: "locations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_stock_transactions_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "created_at", "email", "external_id", "full_name", "is_active", "last_login_at", "role_id", "updated_at" },
                values: new object[,]
                {
                    { new Guid("20000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@chemwatch.local", null, "System Admin", true, null, new Guid("a0000000-0000-0000-0000-000000000001"), null },
                    { new Guid("20000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "focalpoint@chemwatch.local", null, "Lab Focal Point", true, null, new Guid("a0000000-0000-0000-0000-000000000002"), null }
                });

            migrationBuilder.InsertData(
                table: "user_labs",
                columns: new[] { "id", "created_at", "is_default", "lab_id", "updated_at", "user_id" },
                values: new object[,]
                {
                    { new Guid("30000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, new Guid("c0000000-0000-0000-0000-000000000001"), null, new Guid("20000000-0000-0000-0000-000000000001") },
                    { new Guid("30000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, new Guid("c0000000-0000-0000-0000-000000000001"), null, new Guid("20000000-0000-0000-0000-000000000002") }
                });

            migrationBuilder.CreateIndex(
                name: "ix_inventory_lots_checked_in_by",
                table: "inventory_lots",
                column: "checked_in_by");

            migrationBuilder.CreateIndex(
                name: "ix_inventory_lots_expiry_date",
                table: "inventory_lots",
                column: "expiry_date");

            migrationBuilder.CreateIndex(
                name: "ix_inventory_lots_item_id",
                table: "inventory_lots",
                column: "item_id");

            migrationBuilder.CreateIndex(
                name: "ix_inventory_lots_item_id_lab_id",
                table: "inventory_lots",
                columns: new[] { "item_id", "lab_id" });

            migrationBuilder.CreateIndex(
                name: "ix_inventory_lots_lab_id",
                table: "inventory_lots",
                column: "lab_id");

            migrationBuilder.CreateIndex(
                name: "ix_inventory_lots_location_id",
                table: "inventory_lots",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "ix_inventory_lots_lot_number",
                table: "inventory_lots",
                column: "lot_number");

            migrationBuilder.CreateIndex(
                name: "ix_inventory_lots_status",
                table: "inventory_lots",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_inventory_lots_vendor_id",
                table: "inventory_lots",
                column: "vendor_id");

            migrationBuilder.CreateIndex(
                name: "ix_stock_transactions_created_at",
                table: "stock_transactions",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "ix_stock_transactions_item_id",
                table: "stock_transactions",
                column: "item_id");

            migrationBuilder.CreateIndex(
                name: "ix_stock_transactions_lab_id",
                table: "stock_transactions",
                column: "lab_id");

            migrationBuilder.CreateIndex(
                name: "ix_stock_transactions_location_id",
                table: "stock_transactions",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "ix_stock_transactions_lot_id",
                table: "stock_transactions",
                column: "lot_id");

            migrationBuilder.CreateIndex(
                name: "ix_stock_transactions_purchase_request_id",
                table: "stock_transactions",
                column: "purchase_request_id");

            migrationBuilder.CreateIndex(
                name: "ix_stock_transactions_transaction_type",
                table: "stock_transactions",
                column: "transaction_type");

            migrationBuilder.CreateIndex(
                name: "ix_stock_transactions_user_id",
                table: "stock_transactions",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "stock_transactions");

            migrationBuilder.DropTable(
                name: "inventory_lots");

            migrationBuilder.DeleteData(
                table: "user_labs",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "user_labs",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"));
        }
    }
}
