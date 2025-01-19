using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
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

        public UserData Sender { get; set; }

        public UserData Receiver { get; set; }

    }
}
