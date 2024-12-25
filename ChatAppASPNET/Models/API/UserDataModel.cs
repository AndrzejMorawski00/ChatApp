using ChatAppASPNET.DBContext.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ChatAppASPNET.Models.API
{
    public class UserDataModel
    {
        public required int ID { get; set; }

        public required string FirstName { get; set; } = string.Empty;

        public required string LastName { get; set; } = string.Empty;


        public required string Email { get; set; } = string.Empty;

    }
}
