using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatAppASPNET.Migrations
{
    /// <inheritdoc />
    public partial class Changefieldsname : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Friends_UserData_FriendID",
                table: "Friends");

            migrationBuilder.DropForeignKey(
                name: "FK_Friends_UserData_UserID",
                table: "Friends");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Friends",
                newName: "SenderID");

            migrationBuilder.RenameColumn(
                name: "FriendID",
                table: "Friends",
                newName: "ReceiverID");

            migrationBuilder.RenameIndex(
                name: "IX_Friends_UserID",
                table: "Friends",
                newName: "IX_Friends_SenderID");

            migrationBuilder.RenameIndex(
                name: "IX_Friends_FriendID",
                table: "Friends",
                newName: "IX_Friends_ReceiverID");

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_UserData_ReceiverID",
                table: "Friends",
                column: "ReceiverID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_UserData_SenderID",
                table: "Friends",
                column: "SenderID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Friends_UserData_ReceiverID",
                table: "Friends");

            migrationBuilder.DropForeignKey(
                name: "FK_Friends_UserData_SenderID",
                table: "Friends");

            migrationBuilder.RenameColumn(
                name: "SenderID",
                table: "Friends",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "ReceiverID",
                table: "Friends",
                newName: "FriendID");

            migrationBuilder.RenameIndex(
                name: "IX_Friends_SenderID",
                table: "Friends",
                newName: "IX_Friends_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Friends_ReceiverID",
                table: "Friends",
                newName: "IX_Friends_FriendID");

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_UserData_FriendID",
                table: "Friends",
                column: "FriendID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_UserData_UserID",
                table: "Friends",
                column: "UserID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
