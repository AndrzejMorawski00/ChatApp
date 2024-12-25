using ChatAppASPNET.DBContext.Entities;

namespace ChatAppASPNET.Models.API
{
    public class FriendModel
    {
        public int ID { get; set; }

        public int SenderID { get; set; }

        public int ReciverID { get; set; }

        public UserDataModel FriendData { get; set; }

        public FriendshipStatus Status { get; set; }

    }
}


