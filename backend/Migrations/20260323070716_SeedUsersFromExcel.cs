using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ChemWatch.Migrations
{
    /// <inheritdoc />
    public partial class SeedUsersFromExcel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "created_at", "email", "full_name", "is_active", "last_login_at", "location_scope_type", "password_hash", "role_id", "updated_at" },
                values: new object[,]
                {
                    { new Guid("20000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "mprapapan@dow.com", "Prapapan", true, null, "all", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000001"), null },
                    { new Guid("20000000-0000-0000-0000-000000000003"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "sutarinee@dow.com", "Wataporn", true, null, "all", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000001"), null },
                    { new Guid("20000000-0000-0000-0000-000000000004"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "kboonyathee@dow.com", "Kunlaya", true, null, "all", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000001"), null },
                    { new Guid("20000000-0000-0000-0000-000000000005"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "kannarach@dow.com", "Kannarach", true, null, "all", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000002"), null },
                    { new Guid("20000000-0000-0000-0000-000000000006"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "natee@dow.com", "Natee", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000002"), null },
                    { new Guid("20000000-0000-0000-0000-000000000007"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "panida@dow.com", "Panida", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000002"), null },
                    { new Guid("20000000-0000-0000-0000-000000000008"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "thongchai@dow.com", "Thongchai", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000002"), null },
                    { new Guid("20000000-0000-0000-0000-000000000009"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "nantawan@dow.com", "Nantawan", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000002"), null },
                    { new Guid("20000000-0000-0000-0000-00000000000a"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "onwara@dow.com", "Onwara", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000002"), null },
                    { new Guid("20000000-0000-0000-0000-00000000000b"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "kesinee@dow.com", "Kesinee", true, null, "all", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-00000000000c"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "nattaporna@dow.com", "NattapornA", true, null, "all", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-00000000000d"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "suwichar@dow.com", "Suwichar", true, null, "all", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-00000000000e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "nattapornk@dow.com", "NattapornK", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-00000000000f"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "jariya@dow.com", "Jariya", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000010"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "chonnipa@dow.com", "Chonnipa", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000011"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "soparat@dow.com", "Soparat", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000012"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "sriprai@dow.com", "Sriprai", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000013"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "wanna@dow.com", "Wanna", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000014"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "supawadee@dow.com", "Supawadee", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000015"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "nannaphas@dow.com", "Nannaphas", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000016"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "sunisa@dow.com", "Sunisa", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000017"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "sudarat@dow.com", "Sudarat", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000018"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "saowaluck@dow.com", "Saowaluck", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null },
                    { new Guid("20000000-0000-0000-0000-000000000019"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "narinl@dow.com", "NarinL", true, null, "specific", "$2a$11$KXpGgVx0kUsaH5SzYFnBxu3pBXYf3MkGz8S1G0gKjHc5xV3uMCPyG", new Guid("a0000000-0000-0000-0000-000000000003"), null }
                });

            migrationBuilder.InsertData(
                table: "user_locations",
                columns: new[] { "id", "created_at", "location_id", "user_id" },
                values: new object[,]
                {
                    { new Guid("30000000-0000-0000-0000-000000000001"), new DateTime(2026, 3, 23, 7, 7, 13, 868, DateTimeKind.Utc).AddTicks(9509), new Guid("b0000000-0000-0000-0000-000000000001"), new Guid("20000000-0000-0000-0000-000000000006") },
                    { new Guid("30000000-0000-0000-0000-000000000002"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(806), new Guid("b0000000-0000-0000-0000-000000000001"), new Guid("20000000-0000-0000-0000-000000000007") },
                    { new Guid("30000000-0000-0000-0000-000000000003"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(812), new Guid("b0000000-0000-0000-0000-000000000002"), new Guid("20000000-0000-0000-0000-000000000008") },
                    { new Guid("30000000-0000-0000-0000-000000000004"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(817), new Guid("b0000000-0000-0000-0000-000000000001"), new Guid("20000000-0000-0000-0000-000000000009") },
                    { new Guid("30000000-0000-0000-0000-000000000005"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(822), new Guid("b0000000-0000-0000-0000-000000000003"), new Guid("20000000-0000-0000-0000-00000000000a") },
                    { new Guid("30000000-0000-0000-0000-000000000006"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(823), new Guid("b0000000-0000-0000-0000-000000000004"), new Guid("20000000-0000-0000-0000-00000000000e") },
                    { new Guid("30000000-0000-0000-0000-000000000007"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(825), new Guid("b0000000-0000-0000-0000-000000000001"), new Guid("20000000-0000-0000-0000-00000000000f") },
                    { new Guid("30000000-0000-0000-0000-000000000008"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(826), new Guid("b0000000-0000-0000-0000-000000000002"), new Guid("20000000-0000-0000-0000-000000000010") },
                    { new Guid("30000000-0000-0000-0000-000000000009"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(827), new Guid("b0000000-0000-0000-0000-000000000004"), new Guid("20000000-0000-0000-0000-000000000011") },
                    { new Guid("30000000-0000-0000-0000-00000000000a"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(829), new Guid("b0000000-0000-0000-0000-000000000001"), new Guid("20000000-0000-0000-0000-000000000012") },
                    { new Guid("30000000-0000-0000-0000-00000000000b"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(830), new Guid("b0000000-0000-0000-0000-000000000002"), new Guid("20000000-0000-0000-0000-000000000013") },
                    { new Guid("30000000-0000-0000-0000-00000000000c"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(832), new Guid("b0000000-0000-0000-0000-000000000002"), new Guid("20000000-0000-0000-0000-000000000014") },
                    { new Guid("30000000-0000-0000-0000-00000000000d"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(833), new Guid("b0000000-0000-0000-0000-000000000002"), new Guid("20000000-0000-0000-0000-000000000015") },
                    { new Guid("30000000-0000-0000-0000-00000000000e"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(835), new Guid("b0000000-0000-0000-0000-000000000002"), new Guid("20000000-0000-0000-0000-000000000016") },
                    { new Guid("30000000-0000-0000-0000-00000000000f"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(836), new Guid("b0000000-0000-0000-0000-000000000002"), new Guid("20000000-0000-0000-0000-000000000017") },
                    { new Guid("30000000-0000-0000-0000-000000000010"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(838), new Guid("b0000000-0000-0000-0000-000000000002"), new Guid("20000000-0000-0000-0000-000000000018") },
                    { new Guid("30000000-0000-0000-0000-000000000011"), new DateTime(2026, 3, 23, 7, 7, 13, 869, DateTimeKind.Utc).AddTicks(839), new Guid("b0000000-0000-0000-0000-000000000003"), new Guid("20000000-0000-0000-0000-000000000019") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000006"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000007"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000008"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000009"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-00000000000a"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-00000000000b"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-00000000000c"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-00000000000d"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-00000000000e"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-00000000000f"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000010"));

            migrationBuilder.DeleteData(
                table: "user_locations",
                keyColumn: "id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000011"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-00000000000b"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-00000000000c"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-00000000000d"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000006"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000007"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000008"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000009"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-00000000000a"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-00000000000e"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-00000000000f"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000010"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000011"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000012"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000013"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000014"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000015"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000016"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000017"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000018"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000019"));
        }
    }
}
