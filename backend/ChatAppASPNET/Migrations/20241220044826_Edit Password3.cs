using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatAppASPNET.Migrations
{
    /// <inheritdoc />
    public partial class EditPassword3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Passwords_UserData_UserID",
                table: "Passwords");

            migrationBuilder.DropIndex(
                name: "IX_Passwords_UserID",
                table: "Passwords");

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "Passwords",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Passwords_UserID",
                table: "Passwords",
                column: "UserID",
                unique: true,
                filter: "[UserID] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Passwords_UserData_UserID",
                table: "Passwords",
                column: "UserID",
                principalTable: "UserData",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Passwords_UserData_UserID",
                table: "Passwords");

            migrationBuilder.DropIndex(
                name: "IX_Passwords_UserID",
                table: "Passwords");

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "Passwords",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Passwords_UserID",
                table: "Passwords",
                column: "UserID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Passwords_UserData_UserID",
                table: "Passwords",
                column: "UserID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
