using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class UserData
    {
        [Key]
        public int ID { get; set; }


        [Required]
        [MaxLength(256)]
        public string FirstName { get; set; } = String.Empty;
        [Required]
        [MaxLength(256)]
        public string LastName { get; set; } = String.Empty;

        [Required]
        [MaxLength(256)]
        public string Email { get; set; } = String.Empty;


        public Password? Password { get; set; }
        public ICollection<Friend>? Friends { get; set; } = new List<Friend>();

        public ICollection<ChatParticipant> Participants { get; set; } = new List<ChatParticipant>();

        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
