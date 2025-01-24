namespace Entities
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
        public string ChatName { get; set; } = String.Empty;
        public int? OwnerID { get; set; }
        public required UserData? Owner { get; set; }
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<ChatParticipant> Participants { get; set; } = new List<ChatParticipant>();
    }
}
