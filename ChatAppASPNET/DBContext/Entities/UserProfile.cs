using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ChatAppASPNET.DBContext.Entities
{
    [Table("UserAdditionalData")]
    public class UserProfile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [MaxLength]
        public string ProfileImage { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string LastName { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public UserData UserData { get; set; } = null!;
    }
}


