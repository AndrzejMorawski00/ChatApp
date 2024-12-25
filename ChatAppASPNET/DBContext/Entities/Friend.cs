using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatAppASPNET.DBContext.Entities
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

        public UserData User { get; set; }

        public UserData FriendUser { get; set; }

    }

}

