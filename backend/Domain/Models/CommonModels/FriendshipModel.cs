using Entities;

namespace Domain.Models.CommonModels
{
    public class FriendshipModel
    {
        public int ID { get; set; }
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public required UserDataModel SenderData { get; set; }
        public required UserDataModel ReceiverData { get; set; }
        public bool IsSender { get; set; }
        public FriendshipStatus Status { get; set; }
    }
}
