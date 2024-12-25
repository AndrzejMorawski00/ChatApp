using Azure.Core;
using ChatAppASPNET.DBContext;
using ChatAppASPNET.DBContext.Entities;
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

                var friendshipRequest = new Friend
                {
                    SenderID = user.ID,
                    ReceiverID = friend.ID,
                    Status = FriendshipStatus.Pending,
                };

                await _dbContext.Friends.AddAsync(friendshipRequest);
                await _dbContext.SaveChangesAsync();

                await Clients.Groups(userEmail).SendAsync("FriendshipRequestRecieved");
                await Clients.Groups(friendEmail).SendAsync("FriendshipRequestRecieved");
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

                var friendshipRequest = await _dbContext.Friends.FirstOrDefaultAsync(fr => fr.ID == friendshipId);

                if (friendshipRequest == null)
                {
                    throw new Exception("Failed to fetch friendship object");
                }
                friendshipRequest.Status = FriendshipStatus.Accepted;

                var friendID = friendshipRequest.SenderID == user.ID ? friendshipRequest.ReceiverID : friendshipRequest.SenderID;

                var friend = await _dbContext.UserData.FirstOrDefaultAsync(u => u.ID == friendID);
                if (friend == null)
                {
                    throw new Exception("Failed to fetch friend");
                }


                var existingChat = await _dbContext.Chats
                    .Where(c => c.Participants.Any(p => p.UserID == user.ID) && c.Participants.Any(p => p.UserID == friend.ID))
                    .FirstOrDefaultAsync();

                if (existingChat == null)
                {
                    var newChat = new Chat
                    {
                        ChatType = ChatType.DM, 
                        ChatName = $"{user.FirstName} & {friend.FirstName}", 
                        Participants = new List<ChatParticipant>
                {
                    new ChatParticipant { UserID = user.ID },
                    new ChatParticipant { UserID = friend.ID }
                },
                        Messages = new List<Message>() 
                    };

                    _dbContext.Chats.Add(newChat);
                    await _dbContext.SaveChangesAsync(); 
                }

                await _dbContext.SaveChangesAsync();

                await _dbContext.SaveChangesAsync();

                Console.WriteLine($"User Email: {userEmail} Friend Email:{friend.Email} ");
                await Clients.Group(userEmail).SendAsync("FriendshipAccepted");
                await Clients.Group(friend.Email).SendAsync("FriendshipAccepted");
            }

            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: { ex.Message}");
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

                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.ID == friendship.SenderID);
                var friend = await _dbContext.UserData.FirstOrDefaultAsync(u => u.ID == friendship.ReceiverID);

                if (user == null || friend == null)
                {
                    throw new Exception("Failed to fetch user or friend");
                }

                _dbContext.Remove(friendship);
                await _dbContext.SaveChangesAsync();


                await Clients.Group(user.Email).SendAsync("FriendshiCanceled");
                await Clients.Group(friend.Email).SendAsync("FriendshiCanceled");

            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public async Task SendMessage([FromBody] SimpleMessageModel model)
        {
            Console.WriteLine("Hello world");
            try
            {
                Console.WriteLine($"Message received from {model.UserName}: {model.Content}");
                var dbMessage = new SimpleMessage
                {
                    CID = model.CID,
                    UserName = model.UserName,
                    Content = model.Content,
                    CreatedTime = DateTime.UtcNow,
                };

                await _dbContext.AddAsync(dbMessage);
                await _dbContext.SaveChangesAsync();
                await Clients.All.SendAsync("ReceiveMessage");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SendMessage: {ex.Message}");
                throw;
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
