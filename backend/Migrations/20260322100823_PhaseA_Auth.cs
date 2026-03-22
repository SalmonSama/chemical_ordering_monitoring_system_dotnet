using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChemWatch.Migrations
{
    /// <inheritdoc />
    public partial class PhaseA_Auth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_labs");

            migrationBuilder.DeleteData(
                table: "roles",
                keyColumn: "id",
                keyValue: new Guid("a0000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"));

            migrationBuilder.DropColumn(
                name: "external_id",
                table: "users");

            migrationBuilder.AddColumn<string>(
                name: "location_scope_type",
                table: "users",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "password_hash",
                table: "users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "user_locations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    location_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_locations", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_locations_locations_location_id",
                        column: x => x.location_id,
                        principalTable: "locations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user_locations_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: new Guid("a0000000-0000-0000-0000-000000000002"),
                columns: new[] { "description", "display_name" },
                values: new object[] { "Manages operations for assigned locations. Approves orders, manages inventory.", "Focal Point" });

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: new Guid("a0000000-0000-0000-0000-000000000003"),
                columns: new[] { "display_name", "name" },
                values: new object[] { "User", "user" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "location_scope_type", "password_hash" },
                values: new object[] { "all", "$2a$11$oUlgSKiiH8PFFxMbXLVDd.HSCG5mr4V9z4ooOHyhUCJWYTspR4kte" });

            migrationBuilder.CreateIndex(
                name: "ix_user_locations_location_id",
                table: "user_locations",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_locations_user_id_location_id",
                table: "user_locations",
                columns: new[] { "user_id", "location_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_locations");

            migrationBuilder.DropColumn(
                name: "location_scope_type",
                table: "users");

            migrationBuilder.DropColumn(
                name: "password_hash",
                table: "users");

            migrationBuilder.AddColumn<string>(
                name: "external_id",
                table: "users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "user_labs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    lab_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    is_default = table.Column<bool>(type: "boolean", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
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

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: new Guid("a0000000-0000-0000-0000-000000000002"),
                columns: new[] { "description", "display_name" },
                values: new object[] { "Manages operations for assigned labs. Approves orders, monitors inventory.", "Focal Point / Lab Manager" });

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: new Guid("a0000000-0000-0000-0000-000000000003"),
                columns: new[] { "display_name", "name" },
                values: new object[] { "Lab User", "lab_user" });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "created_at", "description", "display_name", "is_active", "name", "updated_at" },
                values: new object[] { new Guid("a0000000-0000-0000-0000-000000000004"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Read-only access for compliance review and audit purposes.", "Viewer / Auditor", true, "viewer", null });

            migrationBuilder.InsertData(
                table: "user_labs",
                columns: new[] { "id", "created_at", "is_default", "lab_id", "updated_at", "user_id" },
                values: new object[] { new Guid("30000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, new Guid("c0000000-0000-0000-0000-000000000001"), null, new Guid("20000000-0000-0000-0000-000000000001") });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                column: "external_id",
                value: null);

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "created_at", "email", "external_id", "full_name", "is_active", "last_login_at", "role_id", "updated_at" },
                values: new object[] { new Guid("20000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "focalpoint@chemwatch.local", null, "Lab Focal Point", true, null, new Guid("a0000000-0000-0000-0000-000000000002"), null });

            migrationBuilder.InsertData(
                table: "user_labs",
                columns: new[] { "id", "created_at", "is_default", "lab_id", "updated_at", "user_id" },
                values: new object[] { new Guid("30000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, new Guid("c0000000-0000-0000-0000-000000000001"), null, new Guid("20000000-0000-0000-0000-000000000002") });

            migrationBuilder.CreateIndex(
                name: "ix_user_labs_lab_id",
                table: "user_labs",
                column: "lab_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_labs_user_id_lab_id",
                table: "user_labs",
                columns: new[] { "user_id", "lab_id" },
                unique: true);
        }
    }
}
