using Domain.Models;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Utils
    {
        public static string GetChatName(UserData user, Chat chat)
        {
            if (chat.ChatType == ChatType.Group)
            {
                return chat.ChatName;
            }
            if (chat.Participants.Count != 2)
            {
                return chat.ChatName;
            }
            var p1 = chat.Participants.FirstOrDefault(cp => cp.UserID == user.ID);
            var p2 = chat.Participants.FirstOrDefault(cp => cp.UserID != user.ID);

            if (p1 != null)
            {
                return p2.User.FirstName;
            }
            if (p2 != null)
            {
                return p2.User.FirstName;
            }
            return chat.ChatName;
        }
    }

   
}
