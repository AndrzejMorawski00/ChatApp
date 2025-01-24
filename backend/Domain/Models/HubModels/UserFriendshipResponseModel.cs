using Domain.Models.CommonModels;

namespace Domain.Models.HubModels
{
    public class UserFriendshipResponseModel
    {
        public required List<UserDataModel> Users { get; set; }
        public required Dictionary<string, List<FriendshipModel>> Friendships { get; set; }
    }
}
