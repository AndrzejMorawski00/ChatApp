using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatAppASPNET.Migrations
{
    /// <inheritdoc />
    public partial class dosomechanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Chats_ChatID",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_UserData_SenderID",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Passwords_UserData_UserID",
                table: "Passwords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Message",
                table: "Message");

            migrationBuilder.RenameTable(
                name: "Message",
                newName: "Messages");

            migrationBuilder.RenameIndex(
                name: "IX_Message_SenderID",
                table: "Messages",
                newName: "IX_Messages_SenderID");

            migrationBuilder.RenameIndex(
                name: "IX_Message_ChatID",
                table: "Messages",
                newName: "IX_Messages_ChatID");

            migrationBuilder.AddColumn<int>(
                name: "Owner",
                table: "Chats",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Messages",
                table: "Messages",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Chats_ChatID",
                table: "Messages",
                column: "ChatID",
                principalTable: "Chats",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_UserData_SenderID",
                table: "Messages",
                column: "SenderID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

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
                name: "FK_Messages_Chats_ChatID",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_UserData_SenderID",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Passwords_UserData_UserID",
                table: "Passwords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Messages",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "Chats");

            migrationBuilder.RenameTable(
                name: "Messages",
                newName: "Message");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_SenderID",
                table: "Message",
                newName: "IX_Message_SenderID");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ChatID",
                table: "Message",
                newName: "IX_Message_ChatID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Message",
                table: "Message",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Chats_ChatID",
                table: "Message",
                column: "ChatID",
                principalTable: "Chats",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_UserData_SenderID",
                table: "Message",
                column: "SenderID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Passwords_UserData_UserID",
                table: "Passwords",
                column: "UserID",
                principalTable: "UserData",
                principalColumn: "ID");
        }
    }
}
