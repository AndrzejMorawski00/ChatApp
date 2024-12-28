using ChatAppASPNET.DBContext.Entities;

namespace ChatAppASPNET.Models.API
{
    public class ChatModel
    {
        public int ID { get; set; }

        public ChatType ChatType { get; set; }

        public string ChatName { get; set; } = string.Empty;

        public int Owner { get; set; }

        public ICollection<ChatParticipantModel> ChatParticipants = new List<ChatParticipantModel>();
    }
}
