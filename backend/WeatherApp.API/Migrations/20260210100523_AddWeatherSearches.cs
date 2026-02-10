using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WeatherApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWeatherSearches : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WeatherSearches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    SearchedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ConditionMain = table.Column<string>(type: "text", nullable: false),
                    ConditionDescription = table.Column<string>(type: "text", nullable: false),
                    TempC = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeatherSearches", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WeatherSearches_UserId_SearchedAtUtc",
                table: "WeatherSearches",
                columns: new[] { "UserId", "SearchedAtUtc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WeatherSearches");
        }
    }
}
