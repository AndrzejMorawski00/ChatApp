using System.ComponentModel.DataAnnotations;

namespace Entities
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
        public ICollection<Friend> Friends { get; set; } = new List<Friend>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<Chat> Chats { get; set; } = new List<Chat>();
        public ICollection<ChatParticipant> Participants { get; set; } = new List<ChatParticipant>();
    }
}
