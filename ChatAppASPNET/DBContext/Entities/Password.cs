using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ChatAppASPNET.DBContext.Entities
{
    [Table("Password")]
    public class Password
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Salt { get; set; } = String.Empty;

        public int HashingRounds { get; set; }

        public DateTime PasswordSetDate { get; set; }
    }
}
