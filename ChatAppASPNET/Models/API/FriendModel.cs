using ChatAppASPNET.DBContext.Entities;

namespace ChatAppASPNET.Models.API
{
    public class FriendModel
    {
        public int ID { get; set; }
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public UserDataModel SenderData { get; set; }
        public UserDataModel ReceiverData { get; set; }
        public bool IsSender { get; set; }

        public FriendshipStatus Status { get; set; }

    }
}


