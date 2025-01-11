using ChatAppASPNET.DBContext;
using ChatAppASPNET.DBContext.Entities;
using ChatAppASPNET.Models.API;
using ChatAppASPNET.Models.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Security.Claims;

namespace ChatAppASPNET
{
    public class Utils
    {

        public static UserDataModel ToUserDataModel(UserData user)
        {
            var model = new UserDataModel
            {
                ID = user.ID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
            };
            return model;
        }


        public static Dictionary<string, List<FriendModel>> DivideFriendshipsByUser(List<FriendModel> FriendshipModels)
        {

            var friendshipResponse = new Dictionary<string, List<FriendModel>>()
            {
                { "accepted", new List<FriendModel>() },
                { "sent", new List<FriendModel>() },
                { "received", new List<FriendModel>() }
            };

            foreach (var friendship in FriendshipModels)
            {
                if (friendship.Status == FriendshipStatus.Accepted)
                {
                    friendshipResponse["accepted"].Add(friendship);
                }
                else if (friendship.Status != FriendshipStatus.Accepted && friendship.IsSender)
                {
                    friendshipResponse["sent"].Add(friendship);
                }
                else if (friendship.Status != FriendshipStatus.Accepted && !friendship.IsSender)
                {
                    friendshipResponse["received"].Add(friendship);
                }
            }
            return friendshipResponse;
        }

        public static async Task<AddFriendResponseModel> GenerateAddNewFriendResponse(AppDBContext DBContext, UserData user)
        {
            var relatedUsersQuery = DBContext.Friends.Where(f => f.SenderID == user.ID || f.ReceiverID == user.ID);

            var relatedUserIDs = await relatedUsersQuery.Select(f => f.SenderID == user.ID ? f.ReceiverID : f.SenderID).ToListAsync();

            var usersModels = await DBContext.UserData.Where(u => u.ID != user.ID && !relatedUserIDs.Contains(u.ID)).OrderBy(u => u.LastName).OrderBy(u => u.FirstName).Select(u => new UserDataModel
            {
                ID = u.ID,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
            }).ToListAsync();

            var friendshipModels = await relatedUsersQuery.Include(f => f.Sender).Include(f => f.Receiver).Select(f => new FriendModel
            {
                ID = f.ID,
                SenderID = f.SenderID,
                SenderData = new UserDataModel
                {
                    ID = f.Sender.ID,
                    Email = f.Sender.Email,
                    FirstName = f.Sender.FirstName,
                    LastName = f.Sender.LastName,
                },
                ReceiverID = f.ReceiverID,
                ReceiverData = new UserDataModel
                {
                    ID = f.Receiver.ID,
                    Email = f.Receiver.Email,
                    FirstName = f.Receiver.FirstName,
                    LastName = f.Receiver.LastName,
                },
                IsSender = f.SenderID == user.ID,
                Status = f.Status


            }).ToListAsync();

            var userResponse =
             new AddFriendResponseModel()
             {
                 Users = usersModels,
                 Friendships = DivideFriendshipsByUser(friendshipModels)
             };

            return userResponse;
        }


        public static async Task<Dictionary<string, List<FriendModel>>> GenerateAcceptFriendResponse(AppDBContext DBContext, UserData user)
        {
            var relatedUsersQuery = DBContext.Friends.Where(f => f.SenderID == user.ID || f.ReceiverID == user.ID);

            var friendshipModels = await relatedUsersQuery.Include(f => f.Sender).Include(f => f.Receiver).Select(f => new FriendModel
            {
                ID = f.ID,
                SenderID = f.SenderID,
                SenderData = new UserDataModel
                {
                    ID = f.Sender.ID,
                    Email = f.Sender.Email,
                    FirstName = f.Sender.FirstName,
                    LastName = f.Sender.LastName,
                },
                ReceiverID = f.ReceiverID,
                ReceiverData = new UserDataModel
                {
                    ID = f.Receiver.ID,
                    Email = f.Receiver.Email,
                    FirstName = f.Receiver.FirstName,
                    LastName = f.Receiver.LastName,
                },
                IsSender = f.SenderID == user.ID,
                Status = f.Status
            }).ToListAsync();

            var userResponse = DivideFriendshipsByUser(friendshipModels);
            return userResponse;
        }


        public static async Task<List<ChatModel>>  UserChatList(AppDBContext DBContext, UserData user)
        {
            var userChats =await  DBContext.Chats
                .Include(c => c.Participants).ThenInclude(cp => cp.User)
                .Where(c => c.Participants.Any(p => p.UserID == user.ID))
                .Select(c => new ChatModel
                {
                    ID = c.ID,
                    ChatType = (int)c.ChatType,
                    ChatName = c.ChatName,
                    Owner = c.Owner,
                    IsOwner = c.Owner == user.ID,
                    ChatParticipants = c.Participants.Select(p => new ChatParticipantModel
                    {
                        ID = p.UserID,
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName
                    })
                        .ToList()
                })
                .ToListAsync();
            return userChats;
        }
        public static async Task<AuthenticateUserResponse> AuthenticateUser(HubCallerContext context, AppDBContext DBContext)
        {
            var userEmail = context.User?.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return new AuthenticateUserResponse()
                {
                    ErrorMessage = "Failed to fetch user email",
                };
            }

            var user = await DBContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return new AuthenticateUserResponse
                {
                    ErrorMessage = "Failed to fetch user data",
                };
            }

            return new AuthenticateUserResponse
            {
                User = user,
            };
        }
    }
}



