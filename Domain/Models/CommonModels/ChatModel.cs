namespace Domain.Models.CommonModels
{
    public class ChatModel
    {
        public int ID { get; set; }

        public int ChatType { get; set; }

        public string ChatName { get; set; } = string.Empty;

        public int Owner { get; set; }

        public bool IsOwner { get; set; }

        public ICollection<ChatParticipantModel> ChatParticipants { get; set; } = new List<ChatParticipantModel>();
    }
}
