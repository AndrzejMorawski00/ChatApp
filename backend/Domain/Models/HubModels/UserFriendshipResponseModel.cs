using Domain.Models.CommonModels;

namespace Domain.Models.HubModels
{
    public class UserFriendshipResponseModel
    {
        public List<UserDataModel> Users { get; set; }
        public Dictionary<string, List<FriendshipModel>> Friendships { get; set; }
    }
}
