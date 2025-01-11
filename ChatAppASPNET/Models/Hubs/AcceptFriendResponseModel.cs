using ChatAppASPNET.Models.API;

namespace ChatAppASPNET.Models.Hubs
{
    public class AcceptFriendResponseModel
    {
        public Dictionary<string, List<FriendModel>> Friendships { get; set; }
    }
}
