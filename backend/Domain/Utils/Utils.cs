using Entities;

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

            if (p1 != null && p1.User != null)
            {
                return p2?.User?.FirstName ?? chat.ChatName;
            }

            if (p2 != null && p2.User != null)
            {
                return p2.User.FirstName;
            }
            return chat.ChatName;
        }
    }
}
