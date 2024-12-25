using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatAppASPNET.Migrations
{
    /// <inheritdoc />
    public partial class EditPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Passwords_UserData_userID",
                table: "Passwords");

            migrationBuilder.RenameColumn(
                name: "userID",
                table: "Passwords",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Passwords_userID",
                table: "Passwords",
                newName: "IX_Passwords_UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Passwords_UserData_UserID",
                table: "Passwords",
                column: "UserID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Passwords_UserData_UserID",
                table: "Passwords");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Passwords",
                newName: "userID");

            migrationBuilder.RenameIndex(
                name: "IX_Passwords_UserID",
                table: "Passwords",
                newName: "IX_Passwords_userID");

            migrationBuilder.AddForeignKey(
                name: "FK_Passwords_UserData_userID",
                table: "Passwords",
                column: "userID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
