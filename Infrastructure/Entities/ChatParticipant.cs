using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class ChatParticipant
    {

        public int ID { get; set; }


        public int ChatID { get; set; }


        public int UserID { get; set; }


        public Chat Chat { get; set; }


        public UserData User { get; set; }

    }
}
