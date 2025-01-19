using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class Password
    {
        [Key]
        public int ID { get; set; }

        [ForeignKey("UserData")]
        public int? UserID { get; set; }

        [Required]
        [MaxLength(256)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(256)]
        public string Salt { get; set; } = String.Empty;

        [Required]
        public int HashingRounds { get; set; } = 12;

        [Required]
        public DateTime PasswordSetDate { get; set; }

        public UserData? User { get; set; }

    }
}
