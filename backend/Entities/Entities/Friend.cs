namespace Entities
{
    public enum FriendshipStatus
    {
        Pending = 0,
        Accepted = 1
    }

    public class Friend
    {
        public int ID { get; set; }
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public FriendshipStatus Status { get; set; }
        public required UserData Sender { get; set; }
        public required UserData Receiver { get; set; }
    }
}