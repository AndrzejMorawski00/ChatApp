using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatAppASPNET.Migrations
{
    /// <inheritdoc />
    public partial class Editchatmodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chats_UserData_UserDataID",
                table: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_Chats_UserDataID",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "UserDataID",
                table: "Chats");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_OwnerID",
                table: "Chats",
                column: "OwnerID");

            migrationBuilder.AddForeignKey(
                name: "FK_Chats_UserData_OwnerID",
                table: "Chats",
                column: "OwnerID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chats_UserData_OwnerID",
                table: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_Chats_OwnerID",
                table: "Chats");

            migrationBuilder.AddColumn<int>(
                name: "UserDataID",
                table: "Chats",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Chats_UserDataID",
                table: "Chats",
                column: "UserDataID");

            migrationBuilder.AddForeignKey(
                name: "FK_Chats_UserData_UserDataID",
                table: "Chats",
                column: "UserDataID",
                principalTable: "UserData",
                principalColumn: "ID");
        }
    }
}
