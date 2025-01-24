namespace Entities
{
    public class Message
    {
        public int ID { get; set; }
        public int ChatID { get; set; }
        public int SenderID { get; set; }
        public DateTime SentTime { get; set; }
        public string Content { get; set; } = String.Empty;
        public required Chat Chat { get; set; }
        public required UserData Sender { get; set; }
    }
}
