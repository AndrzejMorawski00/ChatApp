using Azure.Core;
using ChatAppASPNET.DBContext;
using ChatAppASPNET.DBContext.Entities;
using ChatAppASPNET.Models.API;
using ChatAppASPNET.Models.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChatAppASPNET.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        AppDBContext _dbContext;

        public ChatHub(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public override async Task OnConnectedAsync()
        {
            try
            {
                var userEmail = Context?.User?.FindFirst(ClaimTypes.Email)?.Value;

                if (!string.IsNullOrEmpty(userEmail))
                {
                    var clientId = Context?.ConnectionId;

                    await Groups.AddToGroupAsync(clientId!, userEmail);
                    await Clients.Groups(userEmail).SendAsync("Connected");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OnConnectedAsync Error: {ex.Message}");
            }
            await base.OnConnectedAsync();
        }

        public async Task AddFriend(string friendEmail)
        {
            Console.WriteLine("Add Friend");
            try
            {

                var userEmail = Context.User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(userEmail) || string.IsNullOrEmpty(friendEmail))
                {
                    Console.WriteLine("User Email: " + userEmail);
                    Console.WriteLine("Friend Email: " + friendEmail);
                    throw new Exception("Invalid user email or friend email");
                }
                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);
                var friend = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == friendEmail);
                if (user == null || friend == null)
                {
                    throw new Exception("User or friend not found");
                }

                var friendship = new Friend
                {
                    SenderID = user.ID,
                    ReceiverID = friend.ID,
                    Status = FriendshipStatus.Pending,
                };

                await _dbContext.Friends.AddAsync(friendship);
                await _dbContext.SaveChangesAsync();

                var userFriendshipRequestModel = new FriendModel
                {
                    ID = friendship.ID,
                    SenderID = friendship.SenderID,
                    ReceiverID = friendship.ReceiverID,
                    SenderData = Utils.ToUserDataModel(friendship.Sender),
                    ReceiverData = Utils.ToUserDataModel(friendship.Reciever),
                    IsSender = true,
                };

                var friendFriendshipRequestModel = new FriendModel
                {
                    ID = friendship.ID,
                    SenderID = friendship.SenderID,
                    ReceiverID = friendship.ReceiverID,
                    SenderData = Utils.ToUserDataModel(friendship.Sender),
                    ReceiverData = Utils.ToUserDataModel(friendship.Reciever),
                    IsSender = false,
                };

                await Clients.Group(userEmail).SendAsync("FriendshipRequestRecieved", userFriendshipRequestModel);
                await Clients.Group(friendEmail).SendAsync("FriendshipRequestRecieved", friendFriendshipRequestModel);
            }
            catch (Exception ex) { Console.WriteLine(ex.ToString()); }
        }

        public async Task AcceptFriend(int friendshipId)
        {
            try
            {
                var userEmail = Context?.User?.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(userEmail))
                {
                    throw new Exception("Failed to fetch user details");
                }

                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

                if (user == null)
                {
                    throw new Exception("Failed to fetch user");
                }

                var friendship = await _dbContext.Friends.FirstOrDefaultAsync(fr => fr.ID == friendshipId);

                if (friendship == null)
                {
                    throw new Exception("Failed to fetch friendship object");
                }
                friendship.Status = FriendshipStatus.Accepted;

                var friendID = friendship.SenderID == user.ID ? friendship.ReceiverID : friendship.SenderID;

                var friend = await _dbContext.UserData.FirstOrDefaultAsync(u => u.ID == friendID);
                if (friend == null)
                {
                    throw new Exception("Failed to fetch friend");
                }

                var newChat = new Chat
                {
                    ChatType = ChatType.DM,
                    ChatName = $"{user.FirstName} & {friend.FirstName}",
                };

                await _dbContext.Chats.AddAsync(newChat);

                var p1 = new ChatParticipant
                {
                    ChatID = newChat.ID,
                    UserID = user.ID,
                };

                var p2 = new ChatParticipant
                {
                    ChatID = newChat.ID,
                    UserID = friend.ID,
                };

                newChat.Participants.Add(p1);
                newChat.Participants.Add(p2);

                await _dbContext.SaveChangesAsync();

                Console.WriteLine($"User Email: {userEmail} Friend Email:{friend.Email} ");

                var userFriendshipRequestModel = new FriendModel
                {
                    ID = friendship.ID,
                    SenderID = friendship.SenderID,
                    ReceiverID = friendship.ReceiverID,
                    SenderData = Utils.ToUserDataModel(friendship.Sender),
                    ReceiverData = Utils.ToUserDataModel(friendship.Reciever),
                    IsSender = true,
                };

                var friendFriendshipRequestModel = new FriendModel
                {
                    ID = friendship.ID,
                    SenderID = friendship.SenderID,
                    ReceiverID = friendship.ReceiverID,
                    SenderData = Utils.ToUserDataModel(friendship.Sender),
                    ReceiverData = Utils.ToUserDataModel(friendship.Reciever),
                    IsSender = false,
                };


                await Clients.Group(userEmail).SendAsync("FriendshipAccepted", userFriendshipRequestModel);
                await Clients.Group(friend.Email).SendAsync("FriendshipAccepted", friendFriendshipRequestModel);
            }

            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }

        public async Task RemoveFriend(int friendshipID)
        {
            try
            {
                var friendship = await _dbContext.Friends.FirstOrDefaultAsync(fr => fr.ID == friendshipID);

                if (friendship == null)
                {
                    throw new Exception("Failed to fetch friendship object");
                }

                var sender = await _dbContext.UserData.FirstOrDefaultAsync(u => u.ID == friendship.SenderID);
                var receiver = await _dbContext.UserData.FirstOrDefaultAsync(u => u.ID == friendship.ReceiverID);

                if (sender == null || receiver == null)
                {
                    throw new Exception("Failed to fetch user or friend");
                }

                var chat = await _dbContext.Chats
                    .Include(c => c.Participants)
                    .FirstOrDefaultAsync(c =>
                        c.ChatType == ChatType.DM &&
                        c.Participants.Any(p => p.UserID == sender.ID) &&
                        c.Participants.Any(p => p.UserID == receiver.ID));

                if (chat != null)
                {
                    var chatParticipants = chat.Participants.Where(p => p.UserID == sender.ID || p.UserID == receiver.ID).ToList();
                    var messages = _dbContext.Messages.Where(m => m.ChatID == chat.ID).ToList();
                    _dbContext.Messages.RemoveRange(messages);
                    _dbContext.ChatParticipants.RemoveRange(chatParticipants);
                    _dbContext.Chats.Remove(chat);

                }

                var userFriendshipRequestModel = new FriendModel
                {
                    ID = friendship.ID,
                    SenderID = friendship.SenderID,
                    ReceiverID = friendship.ReceiverID,
                    SenderData = Utils.ToUserDataModel(friendship.Sender),
                    ReceiverData = Utils.ToUserDataModel(friendship.Reciever),
                    IsSender= true,
                };

                var friendFriendshipRequestModel = new FriendModel
                {
                    ID = friendship.ID,
                    SenderID = friendship.SenderID,
                    ReceiverID = friendship.ReceiverID,
                    SenderData = Utils.ToUserDataModel(friendship.Sender),
                    ReceiverData = Utils.ToUserDataModel(friendship.Reciever),
                    IsSender = false,
                };

                _dbContext.Remove(friendship);
                await _dbContext.SaveChangesAsync();


                await Clients.Group(sender.Email).SendAsync("FriendshipCancelled", userFriendshipRequestModel);
                await Clients.Group(receiver.Email).SendAsync("FriendshipCancelled", friendFriendshipRequestModel);

            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }


        //public async Task CreateNewChat([FromBody] PostChatModel model)
        //{
        //    try
        //    {
        //        var userEmail = Context?.User?.FindFirst(ClaimTypes.Email)?.Value;
        //        if (string.IsNullOrEmpty(userEmail))
        //        {
        //            throw new Exception("Failed to fetch user data.");
        //        }

        //        var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

        //        if (user == null)
        //        {
        //            throw new Exception("Failed to fetch user data");
        //        }

        //        var newChat = new Chat
        //        {
        //            ChatType = ChatType.Group,
        //            ChatName = model.ChatName,
        //            Owner = user.ID,
        //        };

        //        _dbContext.Add(newChat);

        //        model.ParticipantsID.Add(user.ID);

        //        var userIDSet = new HashSet<int>(model.ParticipantsID);

        //        var participants = await _dbContext.UserData.Where(u => userIDSet.Contains(u.ID)).Select(u => new ChatParticipant
        //        {
        //            ChatID = newChat.ID,
        //            UserID = u.ID,
        //        }).ToListAsync();
        //        _dbContext.ChatParticipants.AddRange(participants);

        //        newChat.Participants = participants;

        //        await _dbContext.SaveChangesAsync();

        //        var groupName = $"{newChat.ChatName}_{newChat.ID}";

        //        foreach (var participant in participants)
        //        {
        //            var participantEmail = participant.User.Email;
        //            await Clients.Group(participantEmail).SendAsync("AddedToChat");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Something went wrong: {ex.Message}");
        //        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        //    }
        //}

        public async Task JoinGroup(int groupID)
        {
            try
            {
                var chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ID == groupID);

                if (chat == null)
                {
                    throw new Exception("Failed to join to a group");
                }

                var groupName = $"{chat.ChatName}_{chat.ID}";
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }

        }

        public async Task SendMessage([FromBody] RequestMessageModel model)
        {
            try
            {
                var userEmail = Context?.User?.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw new Exception("Failed to fetch user data.");
                }

                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);
                var chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ID == model.ChatID);

                if (user == null || chat is null)
                {
                    throw new Exception("Failed to fetch data");
                }

                var newMessage = new Message
                {
                    ChatID = chat.ID,
                    SenderID = user.ID,
                    SentTime = DateTime.Now,
                    Content = model.Content,
                };

                await _dbContext.AddAsync(newMessage);
                await _dbContext.SaveChangesAsync();

                var groupName = $"{chat.ChatName}_{chat.ID}";
                await Clients.Group(groupName).SendAsync("MessageSent");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }


        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var clientId = this.Context.ConnectionId;
            Console.WriteLine(exception);
            Console.WriteLine($"Client disconnected: {clientId}");
            return base.OnDisconnectedAsync(exception);
        }
    }
}
