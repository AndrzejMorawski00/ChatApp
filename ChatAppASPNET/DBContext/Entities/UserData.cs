using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ChatAppASPNET.DBContext.Entities
{
    [Table("UserData")]
    public class UserData
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;
    }
}
