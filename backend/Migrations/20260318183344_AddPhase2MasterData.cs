using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ChemWatch.Migrations
{
    /// <inheritdoc />
    public partial class AddPhase2MasterData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TestItems",
                table: "TestItems");

            migrationBuilder.RenameTable(
                name: "TestItems",
                newName: "test_items");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "test_items",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "test_items",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "test_items",
                newName: "created_at");

            migrationBuilder.AddPrimaryKey(
                name: "pk_test_items",
                table: "test_items",
                column: "id");

            migrationBuilder.CreateTable(
                name: "item_categories",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_item_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "locations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    address = table.Column<string>(type: "text", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_locations", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    display_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "vendors",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    contact_email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    contact_phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    website = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    address = table.Column<string>(type: "text", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_vendors", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "labs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    location_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_labs", x => x.id);
                    table.ForeignKey(
                        name: "fk_labs_locations_location_id",
                        column: x => x.location_id,
                        principalTable: "locations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    external_id = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    full_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    role_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    last_login_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                    table.ForeignKey(
                        name: "fk_users_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    item_name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    item_short_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    part_no = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    cas_no = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    category_id = table.Column<Guid>(type: "uuid", nullable: false),
                    default_vendor_id = table.Column<Guid>(type: "uuid", nullable: true),
                    type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    size = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    unit = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    reference_price = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: true),
                    lead_time_days = table.Column<int>(type: "integer", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    storage_conditions = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    is_orderable = table.Column<bool>(type: "boolean", nullable: false),
                    requires_checkin = table.Column<bool>(type: "boolean", nullable: false),
                    allows_checkout = table.Column<bool>(type: "boolean", nullable: false),
                    tracks_expiry = table.Column<bool>(type: "boolean", nullable: false),
                    requires_peroxide_monitoring = table.Column<bool>(type: "boolean", nullable: false),
                    peroxide_class = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    is_regulatory_related = table.Column<bool>(type: "boolean", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_items_item_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "item_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_items_vendors_default_vendor_id",
                        column: x => x.default_vendor_id,
                        principalTable: "vendors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "user_labs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    lab_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_default = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_labs", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_labs_labs_lab_id",
                        column: x => x.lab_id,
                        principalTable: "labs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user_labs_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "item_lab_settings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    item_id = table.Column<Guid>(type: "uuid", nullable: false),
                    lab_id = table.Column<Guid>(type: "uuid", nullable: false),
                    min_stock = table.Column<decimal>(type: "numeric(12,3)", nullable: true),
                    reorder_quantity = table.Column<decimal>(type: "numeric(12,3)", nullable: true),
                    is_stocked = table.Column<bool>(type: "boolean", nullable: false),
                    storage_sublocation = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_item_lab_settings", x => x.id);
                    table.ForeignKey(
                        name: "fk_item_lab_settings_items_item_id",
                        column: x => x.item_id,
                        principalTable: "items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_item_lab_settings_labs_lab_id",
                        column: x => x.lab_id,
                        principalTable: "labs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "item_categories",
                columns: new[] { "id", "code", "created_at", "description", "display_order", "is_active", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("d0000000-0000-0000-0000-000000000001"), "CHEM", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Laboratory chemicals, solvents, acids, bases, reagents", 1, true, "Chemical & Reagent", null },
                    { new Guid("d0000000-0000-0000-0000-000000000002"), "GAS", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Laboratory gases (nitrogen, argon, etc.)", 2, true, "Gas", null },
                    { new Guid("d0000000-0000-0000-0000-000000000003"), "MAT", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Lab consumables, filters, glassware, PPE", 3, true, "Material & Consumable", null },
                    { new Guid("d0000000-0000-0000-0000-000000000004"), "STD", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Certified reference standards (USP, NIST, etc.)", 4, true, "Verify STD", null }
                });

            migrationBuilder.InsertData(
                table: "locations",
                columns: new[] { "id", "address", "code", "created_at", "is_active", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("b0000000-0000-0000-0000-000000000001"), null, "AIE", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "AIE", null },
                    { new Guid("b0000000-0000-0000-0000-000000000002"), null, "MTP", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "MTP", null },
                    { new Guid("b0000000-0000-0000-0000-000000000003"), null, "CT", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "CT", null },
                    { new Guid("b0000000-0000-0000-0000-000000000004"), null, "ATC", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "ATC", null }
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "created_at", "description", "display_name", "is_active", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("a0000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Full system access across all locations and labs", "Admin", true, "admin", null },
                    { new Guid("a0000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Manages operations for assigned labs. Approves orders, monitors inventory.", "Focal Point / Lab Manager", true, "focal_point", null },
                    { new Guid("a0000000-0000-0000-0000-000000000003"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Day-to-day operational user. Creates orders, checks out chemicals.", "Lab User", true, "lab_user", null },
                    { new Guid("a0000000-0000-0000-0000-000000000004"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Read-only access for compliance review and audit purposes.", "Viewer / Auditor", true, "viewer", null }
                });

            migrationBuilder.InsertData(
                table: "vendors",
                columns: new[] { "id", "address", "code", "contact_email", "contact_phone", "created_at", "is_active", "name", "notes", "updated_at", "website" },
                values: new object[,]
                {
                    { new Guid("e0000000-0000-0000-0000-000000000001"), null, "SIGMA", "orders@sigma.example.com", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "Sigma-Aldrich", null, null, "https://www.sigmaaldrich.com" },
                    { new Guid("e0000000-0000-0000-0000-000000000002"), null, "FISHER", "orders@fisher.example.com", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "Fisher Scientific", null, null, "https://www.fishersci.com" },
                    { new Guid("e0000000-0000-0000-0000-000000000003"), null, "MERCK", "orders@merck.example.com", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "Merck", null, null, "https://www.merck.com" }
                });

            migrationBuilder.InsertData(
                table: "items",
                columns: new[] { "id", "allows_checkout", "cas_no", "category_id", "created_at", "currency", "default_vendor_id", "description", "is_active", "is_orderable", "is_regulatory_related", "item_name", "item_short_name", "lead_time_days", "part_no", "peroxide_class", "reference_price", "requires_checkin", "requires_peroxide_monitoring", "size", "storage_conditions", "tracks_expiry", "type", "unit", "updated_at" },
                values: new object[,]
                {
                    { new Guid("f0000000-0000-0000-0000-000000000001"), true, "67-64-1", new Guid("d0000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", new Guid("e0000000-0000-0000-0000-000000000001"), null, true, true, false, "Acetone", "Acetone", 7, "179124", null, 45.00m, true, false, "2.5 L", "Flammable cabinet", true, "Solvent", "L", null },
                    { new Guid("f0000000-0000-0000-0000-000000000002"), true, "109-99-9", new Guid("d0000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", new Guid("e0000000-0000-0000-0000-000000000001"), null, true, true, true, "Tetrahydrofuran (THF)", "THF", 10, "186562", "B", 62.50m, true, true, "1 L", "Flammable cabinet, away from light", true, "Solvent", "L", null },
                    { new Guid("f0000000-0000-0000-0000-000000000003"), true, "7647-01-0", new Guid("d0000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", new Guid("e0000000-0000-0000-0000-000000000003"), null, true, true, true, "Hydrochloric Acid 37%", "HCl 37%", 7, "320331", null, 35.00m, true, false, "500 mL", "Corrosives cabinet", true, "Acid", "mL", null },
                    { new Guid("f0000000-0000-0000-0000-000000000004"), false, null, new Guid("d0000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", new Guid("e0000000-0000-0000-0000-000000000002"), null, true, true, false, "Nitrogen Gas (N2)", "N2", 3, "NI-UHP-K", null, 120.00m, false, false, "K-size cylinder", null, false, "Compressed Gas", "ea", null },
                    { new Guid("f0000000-0000-0000-0000-000000000005"), false, null, new Guid("d0000000-0000-0000-0000-000000000003"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", new Guid("e0000000-0000-0000-0000-000000000002"), null, true, true, false, "Nitrile Gloves (Medium)", "Gloves M", 5, "NIT-M-100", null, 18.00m, false, false, "Box of 100", null, false, "PPE", "box", null },
                    { new Guid("f0000000-0000-0000-0000-000000000006"), true, null, new Guid("d0000000-0000-0000-0000-000000000004"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, null, true, false, true, "USP Acetaminophen Reference Standard", "USP Acetaminophen", null, "1003009", null, null, true, false, "200 mg", null, true, "Reference Standard", "mg", null }
                });

            migrationBuilder.InsertData(
                table: "labs",
                columns: new[] { "id", "code", "created_at", "description", "is_active", "location_id", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("c0000000-0000-0000-0000-000000000001"), "PO", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000001"), "PO Lab", null },
                    { new Guid("c0000000-0000-0000-0000-000000000002"), "EOU", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000001"), "EOU Lab", null },
                    { new Guid("c0000000-0000-0000-0000-000000000003"), "PG", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000001"), "PG Lab", null },
                    { new Guid("c0000000-0000-0000-0000-000000000004"), "POL", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000001"), "POL Lab", null },
                    { new Guid("c0000000-0000-0000-0000-000000000005"), "SE", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000001"), "SE Lab", null },
                    { new Guid("c0000000-0000-0000-0000-000000000006"), "AIE-SH", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000001"), "Shared", null },
                    { new Guid("c0000000-0000-0000-0000-000000000007"), "EBSM", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000002"), "EBSM Lab", null },
                    { new Guid("c0000000-0000-0000-0000-000000000008"), "PS", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000002"), "PS Lab", null },
                    { new Guid("c0000000-0000-0000-0000-000000000009"), "LATEX", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000002"), "Latex Lab", null },
                    { new Guid("c0000000-0000-0000-0000-00000000000a"), "PU", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000002"), "PU Lab", null },
                    { new Guid("c0000000-0000-0000-0000-00000000000b"), "FM", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000002"), "FM Lab", null },
                    { new Guid("c0000000-0000-0000-0000-00000000000c"), "EFF", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000002"), "EFF Lab", null },
                    { new Guid("c0000000-0000-0000-0000-00000000000d"), "PE", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000002"), "PE Lab", null },
                    { new Guid("c0000000-0000-0000-0000-00000000000e"), "MTP-SH", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000002"), "Shared", null },
                    { new Guid("c0000000-0000-0000-0000-00000000000f"), "CT", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000003"), "CT Lab", null },
                    { new Guid("c0000000-0000-0000-0000-000000000010"), "ATC", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, new Guid("b0000000-0000-0000-0000-000000000004"), "ATC Lab", null }
                });

            migrationBuilder.InsertData(
                table: "item_lab_settings",
                columns: new[] { "id", "created_at", "is_stocked", "item_id", "lab_id", "min_stock", "notes", "reorder_quantity", "storage_sublocation", "updated_at" },
                values: new object[,]
                {
                    { new Guid("10000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, new Guid("f0000000-0000-0000-0000-000000000001"), new Guid("c0000000-0000-0000-0000-000000000001"), 3.0m, null, 5.0m, "Cabinet A2", null },
                    { new Guid("10000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, new Guid("f0000000-0000-0000-0000-000000000001"), new Guid("c0000000-0000-0000-0000-000000000007"), 2.0m, null, 4.0m, "Shelf B1", null },
                    { new Guid("10000000-0000-0000-0000-000000000003"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, new Guid("f0000000-0000-0000-0000-000000000002"), new Guid("c0000000-0000-0000-0000-000000000001"), 2.0m, null, 3.0m, "Flammable Cabinet 1", null },
                    { new Guid("10000000-0000-0000-0000-000000000004"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, new Guid("f0000000-0000-0000-0000-000000000003"), new Guid("c0000000-0000-0000-0000-00000000000f"), 5.0m, null, 10.0m, "Corrosives Cabinet", null }
                });

            migrationBuilder.CreateIndex(
                name: "ix_item_categories_code",
                table: "item_categories",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_item_categories_name",
                table: "item_categories",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_item_lab_settings_item_id_lab_id",
                table: "item_lab_settings",
                columns: new[] { "item_id", "lab_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_item_lab_settings_lab_id",
                table: "item_lab_settings",
                column: "lab_id");

            migrationBuilder.CreateIndex(
                name: "ix_items_category_id",
                table: "items",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_items_default_vendor_id",
                table: "items",
                column: "default_vendor_id");

            migrationBuilder.CreateIndex(
                name: "ix_labs_location_id_name",
                table: "labs",
                columns: new[] { "location_id", "name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_locations_code",
                table: "locations",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_roles_name",
                table: "roles",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_user_labs_lab_id",
                table: "user_labs",
                column: "lab_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_labs_user_id_lab_id",
                table: "user_labs",
                columns: new[] { "user_id", "lab_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_role_id",
                table: "users",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "ix_vendors_name",
                table: "vendors",
                column: "name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "item_lab_settings");

            migrationBuilder.DropTable(
                name: "user_labs");

            migrationBuilder.DropTable(
                name: "items");

            migrationBuilder.DropTable(
                name: "labs");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "item_categories");

            migrationBuilder.DropTable(
                name: "vendors");

            migrationBuilder.DropTable(
                name: "locations");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropPrimaryKey(
                name: "pk_test_items",
                table: "test_items");

            migrationBuilder.RenameTable(
                name: "test_items",
                newName: "TestItems");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "TestItems",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "TestItems",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "TestItems",
                newName: "CreatedAt");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestItems",
                table: "TestItems",
                column: "Id");
        }
    }
}
