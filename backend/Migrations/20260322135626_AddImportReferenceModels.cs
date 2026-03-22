using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChemWatch.Migrations
{
    /// <inheritdoc />
    public partial class AddImportReferenceModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "peroxide_config_rules",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    peroxide_class = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    test_before_use = table.Column<bool>(type: "boolean", nullable: false),
                    test_interval_months = table.Column<int>(type: "integer", nullable: true),
                    dispose_after_opening_months = table.Column<int>(type: "integer", nullable: true),
                    dispose_after_receipt_months = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_peroxide_config_rules", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "po_references",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    po_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    category_id = table.Column<Guid>(type: "uuid", nullable: true),
                    lab_id = table.Column<Guid>(type: "uuid", nullable: true),
                    vendor_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_po_references", x => x.id);
                    table.ForeignKey(
                        name: "fk_po_references_item_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "item_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_po_references_labs_lab_id",
                        column: x => x.lab_id,
                        principalTable: "labs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_po_references_vendors_vendor_id",
                        column: x => x.vendor_id,
                        principalTable: "vendors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "ix_peroxide_config_rules_peroxide_class",
                table: "peroxide_config_rules",
                column: "peroxide_class",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_po_references_category_id",
                table: "po_references",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_po_references_lab_id",
                table: "po_references",
                column: "lab_id");

            migrationBuilder.CreateIndex(
                name: "ix_po_references_po_number",
                table: "po_references",
                column: "po_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_po_references_vendor_id",
                table: "po_references",
                column: "vendor_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "peroxide_config_rules");

            migrationBuilder.DropTable(
                name: "po_references");
        }
    }
}
