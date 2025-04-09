using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace application_tracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadeIssue2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationFolderJobApplication_ApplicationFolders_FoldersId",
                table: "ApplicationFolderJobApplication");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationFolderJobApplication_JobApplications_ApplicationsId",
                table: "ApplicationFolderJobApplication");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationFolderJobApplication_ApplicationFolders_FoldersId",
                table: "ApplicationFolderJobApplication",
                column: "FoldersId",
                principalTable: "ApplicationFolders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationFolderJobApplication_JobApplications_ApplicationsId",
                table: "ApplicationFolderJobApplication",
                column: "ApplicationsId",
                principalTable: "JobApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationFolderJobApplication_ApplicationFolders_FoldersId",
                table: "ApplicationFolderJobApplication");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationFolderJobApplication_JobApplications_ApplicationsId",
                table: "ApplicationFolderJobApplication");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationFolderJobApplication_ApplicationFolders_FoldersId",
                table: "ApplicationFolderJobApplication",
                column: "FoldersId",
                principalTable: "ApplicationFolders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationFolderJobApplication_JobApplications_ApplicationsId",
                table: "ApplicationFolderJobApplication",
                column: "ApplicationsId",
                principalTable: "JobApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
