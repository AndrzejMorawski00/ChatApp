using ChatAppASPNET.Models.API;

namespace ChatAppASPNET.Models.Hubs
{
    public class AddFriendResponseModel
    {
        public List<UserDataModel> Users { get; set; }
        public Dictionary<string, List<FriendModel>> Friendships { get; set; }
    }
}
