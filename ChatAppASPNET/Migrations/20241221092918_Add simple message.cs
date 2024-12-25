using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatAppASPNET.Migrations
{
    /// <inheritdoc />
    public partial class Addsimplemessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CID",
                table: "SimpleMessages",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CID",
                table: "SimpleMessages");
        }
    }
}
