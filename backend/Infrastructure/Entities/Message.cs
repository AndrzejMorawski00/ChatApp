using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class Message
    {

        public int ID { get; set; }


        public int ChatID { get; set; }


        public int SenderID { get; set; }

        public DateTime SentTime { get; set; }

        public string Content { get; set; } = string.Empty;


        public Chat Chat { get; set; }

        public UserData Sender { get; set; }
    }
}
