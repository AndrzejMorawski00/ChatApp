using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatAppASPNET.Migrations
{
    /// <inheritdoc />
    public partial class MigrationChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Friends_UserData_SenderID",
                table: "Friends");

            migrationBuilder.DropTable(
                name: "SimpleMessages");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "Chats");

            migrationBuilder.AddColumn<int>(
                name: "OwnerID",
                table: "Chats",
                type: "int",
                nullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_UserData_SenderID",
                table: "Friends",
                column: "SenderID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chats_UserData_UserDataID",
                table: "Chats");

            migrationBuilder.DropForeignKey(
                name: "FK_Friends_UserData_SenderID",
                table: "Friends");

            migrationBuilder.DropIndex(
                name: "IX_Chats_UserDataID",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "OwnerID",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "UserDataID",
                table: "Chats");

            migrationBuilder.AddColumn<int>(
                name: "Owner",
                table: "Chats",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SimpleMessages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CID = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SimpleMessages", x => x.ID);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_UserData_SenderID",
                table: "Friends",
                column: "SenderID",
                principalTable: "UserData",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
