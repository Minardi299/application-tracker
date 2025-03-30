using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace application_tracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class fixtypo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Sercret",
                table: "TodoItem",
                newName: "Secret");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Secret",
                table: "TodoItem",
                newName: "Sercret");
        }
    }
}
