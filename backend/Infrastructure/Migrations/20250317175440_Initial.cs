using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserData",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    LastName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserData", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Chats",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChatType = table.Column<int>(type: "integer", nullable: false),
                    ChatName = table.Column<string>(type: "text", nullable: false),
                    OwnerID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chats", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Chats_UserData_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "UserData",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Friends",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SenderID = table.Column<int>(type: "integer", nullable: false),
                    ReceiverID = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friends", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Friends_UserData_ReceiverID",
                        column: x => x.ReceiverID,
                        principalTable: "UserData",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Friends_UserData_SenderID",
                        column: x => x.SenderID,
                        principalTable: "UserData",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Passwords",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserID = table.Column<int>(type: "integer", nullable: true),
                    PasswordHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Salt = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    HashingRounds = table.Column<int>(type: "integer", nullable: false),
                    PasswordSetDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Passwords", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Passwords_UserData_UserID",
                        column: x => x.UserID,
                        principalTable: "UserData",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChatParcitipants",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChatID = table.Column<int>(type: "integer", nullable: false),
                    UserID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatParcitipants", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ChatParcitipants_Chats_ChatID",
                        column: x => x.ChatID,
                        principalTable: "Chats",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatParcitipants_UserData_UserID",
                        column: x => x.UserID,
                        principalTable: "UserData",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChatID = table.Column<int>(type: "integer", nullable: false),
                    SenderID = table.Column<int>(type: "integer", nullable: false),
                    SentTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Messages_Chats_ChatID",
                        column: x => x.ChatID,
                        principalTable: "Chats",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Messages_UserData_SenderID",
                        column: x => x.SenderID,
                        principalTable: "UserData",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatParcitipants_ChatID",
                table: "ChatParcitipants",
                column: "ChatID");

            migrationBuilder.CreateIndex(
                name: "IX_ChatParcitipants_UserID",
                table: "ChatParcitipants",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_OwnerID",
                table: "Chats",
                column: "OwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_Friends_ReceiverID",
                table: "Friends",
                column: "ReceiverID");

            migrationBuilder.CreateIndex(
                name: "IX_Friends_SenderID",
                table: "Friends",
                column: "SenderID");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ChatID",
                table: "Messages",
                column: "ChatID");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderID",
                table: "Messages",
                column: "SenderID");

            migrationBuilder.CreateIndex(
                name: "IX_Passwords_UserID",
                table: "Passwords",
                column: "UserID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatParcitipants");

            migrationBuilder.DropTable(
                name: "Friends");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Passwords");

            migrationBuilder.DropTable(
                name: "Chats");

            migrationBuilder.DropTable(
                name: "UserData");
        }
    }
}
