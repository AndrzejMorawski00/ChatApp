namespace Entities
{
    public class ChatParticipant
    {
        public int ID { get; set; }
        public int ChatID { get; set; }
        public int UserID { get; set; }
        public required Chat Chat { get; set; }
        public required UserData User { get; set; }
    }
}
