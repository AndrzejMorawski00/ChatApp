using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ChatAppASPNET.DBContext.Entities
{

    public enum ChatType
    {
        DM,
        Group
    }

    public class Chat
    {

        public int ID { get; set; }


        public ChatType ChatType { get; set; }

        public string ChatName { get; set; } = string.Empty;

        public int Owner { get; set; }

        public ICollection<ChatParticipant> Participants { get; set; } = new List<ChatParticipant>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }

}
