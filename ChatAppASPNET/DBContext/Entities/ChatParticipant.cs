using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ChatAppASPNET.DBContext.Entities
{

    public class ChatParticipant
    {

        public int ID { get; set; }


        public int ChatID { get; set; }


        public int UserID { get; set; }


        public  Chat Chat { get; set; }


        public  UserData User { get; set; }

    }
}
