﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace application_tracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class totalCountForUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalApplicationCount",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalApplicationCount",
                table: "AspNetUsers");
        }
    }
}
