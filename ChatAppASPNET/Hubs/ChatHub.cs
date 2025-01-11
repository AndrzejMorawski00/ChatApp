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
using static ChatAppASPNET.Utils;
using System.Security.Claims;
using System;

namespace ChatAppASPNET.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        AppDBContext _dbContext;
        private static int MIN_CHAT_SIZE = 1;

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


        // Friends
        public async Task AddFriend(string friendEmail)
        {
            try
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email)?.Value;

                if (userEmail == null)
                {
                    throw new Exception("Failed to get user email");
                }

                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);
                var friend = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == friendEmail);
                if (user == null || friend == null)
                {
                    throw new Exception("Failed to fetch user or friend");
                }
                var friendshipExists = await _dbContext.Friends.FirstOrDefaultAsync(f => f.SenderID == user.ID && f.ReceiverID == friend.ID || f.SenderID == friend.ID && f.ReceiverID == user.ID);

                if (friendshipExists != null)
                {
                    await Clients.Group(userEmail).SendAsync("FriendshipExists");
                    return;
                }

                var newFriendship = new Friend
                {
                    SenderID = user.ID,
                    ReceiverID = friend.ID,
                    Status = FriendshipStatus.Pending,
                };

                await _dbContext.AddAsync(newFriendship);
                await _dbContext.SaveChangesAsync();

                var userResponse = await GenerateAddNewFriendResponse(_dbContext, user);
                var friendResponse = await GenerateAddNewFriendResponse(_dbContext, friend);


                await Clients.Group(userEmail).SendAsync("FriendshipRequestRecieved", userResponse);
                await Clients.Group(friendEmail).SendAsync("FriendshipRequestRecieved", friendResponse);


            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }

        public async Task AcceptFriend(int friendshipId)
        {
            try
            {
                var senderEmail = Context?.User?.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(senderEmail))
                {
                    throw new Exception("Failed to fetch sender details");
                }

                var sender = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == senderEmail);

                if (sender == null)
                {
                    throw new Exception("Failed to fetch user");
                }

                var friendship = await _dbContext.Friends.Include(f => f.Sender).Include(f => f.Receiver).FirstOrDefaultAsync(fr => fr.ID == friendshipId && (fr.SenderID == sender.ID || fr.ReceiverID == sender.ID));

                if (friendship == null)
                {
                    throw new Exception("Failed to fetch friendship object");
                }

                var receiver = friendship.SenderID == sender.ID ? friendship.Receiver : friendship.Sender;


                if (sender == null || receiver == null)
                {
                    throw new Exception("Failed to fetch sender or receiver data");
                }


                var newChat = new Chat
                {
                    ChatType = ChatType.DM,
                    ChatName = $"{sender.FirstName} {receiver.FirstName}"
                    
                };
                friendship.Status = FriendshipStatus.Accepted;

                await _dbContext.Chats.AddAsync(newChat);

                var p1 = new ChatParticipant
                {
                    ChatID = newChat.ID,
                    UserID = sender.ID,         
                };

                var p2 = new ChatParticipant
                {
                    ChatID = newChat.ID,
                    UserID = receiver.ID,
                };

                newChat.Participants.Add(p1);
                newChat.Participants.Add(p2);

                await _dbContext.SaveChangesAsync();

                var senderResponse = await GenerateAcceptFriendResponse(_dbContext, sender);
                var receiverResponse = await GenerateAcceptFriendResponse(_dbContext, receiver);

                await Clients.Group(sender.Email).SendAsync("FriendshipAccepted", senderResponse);
                await Clients.Group(receiver.Email).SendAsync("FriendshipAccepted", receiverResponse);
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
                var userEmail = Context.User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(userEmail))
                {
                    throw new Exception("Invalid user email or friend email");
                }

                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

                if (user == null)
                {
                    throw new Exception("Failed to fetch user data");
                }
                // Czy takie includowanie jest okej?
                var friendship = await _dbContext.Friends.Include(f => f.Sender).Include(f => f.Receiver).FirstOrDefaultAsync(f => f.ID == friendshipID);

                if (friendship == null)
                {
                    throw new Exception("Failed to fetch friendship data");
                }

                var friend = friendship.SenderID == user.ID ? friendship.Receiver : friendship.Sender;

                if (friend == null)
                {
                    throw new Exception("Failed to fetch friend data");
                }

                // Czy można to jakoś ładniej usunąć?
                if (friendship.Status == FriendshipStatus.Accepted)
                {
                    // Remove Chats
                    var chat = await _dbContext.Chats.Include(c => c.Participants)
                            .FirstOrDefaultAsync(c => c.ChatType == ChatType.DM
                                                   && c.Participants.Any(p => p.UserID == user.ID)
                                                   && c.Participants.Any(p => p.UserID == friend.ID));

                    if (chat != null)
                    {
                        var chatParticipants = chat.Participants.Where(p => p.UserID == user.ID || p.UserID == friend.ID).ToList();
                        var messages = _dbContext.Messages.Where(m => m.ChatID == chat.ID).ToList();
                        _dbContext.Messages.RemoveRange(messages);
                        _dbContext.ChatParticipants.RemoveRange(chatParticipants);
                        _dbContext.Chats.Remove(chat);

                    }
                }
                _dbContext.Remove(friendship);
                await _dbContext.SaveChangesAsync();

                var userResponse = await GenerateAddNewFriendResponse(_dbContext, user);
                var friendResponse = await GenerateAddNewFriendResponse(_dbContext, friend);

                await Clients.Group(userEmail).SendAsync("FriendshipCancelled", userResponse);
                await Clients.Group(friend.Email).SendAsync("FriendshipCancelled", friendResponse);


            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }


        // Chats
        public async Task CreateNewChat([FromBody] PostChatModel model)
        {
            try
            {
                var authentication = await AuthenticateUser(Context, _dbContext);
                if (!string.IsNullOrEmpty(authentication.ErrorMessage))
                {
                    throw new Exception(authentication.ErrorMessage);
                }
                var user = authentication.User;

                if (model.ChatName == String.Empty || model.ParticipantsID.Count < MIN_CHAT_SIZE)
                {
                    throw new Exception("Invalid Data");
                }

                var userIDSet = new HashSet<int>(model.ParticipantsID);

                var users = await _dbContext.UserData.Where(u => userIDSet.Contains(u.ID)).ToListAsync();

                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {
                    var newChat = new Chat
                    {
                        ChatType = ChatType.Group,
                        ChatName = model.ChatName,
                        Owner = user.ID,
                    };

                    _dbContext.Add(newChat);
                    model.ParticipantsID.Add(user.ID);
                    var participants = users.Select(u => new ChatParticipant
                    {
                        ChatID = newChat.ID,
                        UserID = u.ID,
                    }).ToList();
                    _dbContext.ChatParticipants.AddRange(participants);

                    newChat.Participants = participants;
                    await _dbContext.SaveChangesAsync();
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }


                foreach (var u in users)
                {
                    var participantResponse = await UserChatList(_dbContext, u);
                    await Clients.Group(u.Email).SendAsync("AddedToChat", participantResponse);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }

        public async Task LeaveChat(int chatID)
        {
            try
            {
                var authentication = await AuthenticateUser(Context, _dbContext);
                if (!string.IsNullOrEmpty(authentication.ErrorMessage))
                {
                    throw new Exception(authentication.ErrorMessage);
                }
                var user = authentication.User;

                var chat = await _dbContext.Chats.Include(c => c.Participants).ThenInclude(cp => cp.User).FirstOrDefaultAsync(c => c.ID == chatID && c.ChatType != ChatType.DM);

                if (chat == null)
                {
                    throw new Exception("Failed to fetch chat");
                }

                var participant = await _dbContext.ChatParticipants.FirstOrDefaultAsync(cp => cp.ChatID == chatID && cp.UserID == user.ID);

                if (participant == null)
                {
                    throw new Exception("Failed to fetch participant Data");
                }
                _dbContext.Remove(participant);
                await _dbContext.SaveChangesAsync();


                var users = chat.Participants.Select(p => p.User).ToList();
                users.Add(user);



                foreach (var u in users)
                {
                    var userChatList = await UserChatList(_dbContext, u);
                    Console.WriteLine($"User Email: {u.Email}");
                    await Clients.Group(u.Email).SendAsync("EditChat", userChatList);

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }

        }

        public async Task DeleteChat(int chatID)
        {
            try
            {
                var authentication = await AuthenticateUser(Context, _dbContext);
                if (!string.IsNullOrEmpty(authentication.ErrorMessage))
                {
                    throw new Exception(authentication.ErrorMessage);
                }
                var user = authentication.User;

                var chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ID == chatID && c.Owner == user.ID);
                if (chat == null)
                {
                    throw new Exception("Failed to fetch chat");
                }

                var messages = _dbContext.Messages.Where(m => m.ChatID == chatID).ToList();
                var chatParticipants = _dbContext.ChatParticipants.Include(c => c.User).Where(c => c.ChatID == chatID).ToList();
                var users = chatParticipants.Select(c => c.User).ToList();

                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {
  
                    _dbContext.Messages.RemoveRange(messages);
                    _dbContext.ChatParticipants.RemoveRange(chatParticipants);
                    _dbContext.Chats.Remove(chat);
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }

                foreach (var u in users)
                {
                    var userChatList = await UserChatList(_dbContext, u);
                    await Clients.Group(u.Email).SendAsync("ChatDeleted", new {
                        chatID= chat.ID,
                        userChatList=  userChatList
                    });

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }

        public async Task EditChat([FromBody] EditChatModel model)
        {
            try
            {

                if (model.ParticipantsID == null || !model.ParticipantsID.Any())
                {
                    throw new Exception("Participant list cannot be empty.");
                }

                var authentication = await AuthenticateUser(Context, _dbContext);
                if (!string.IsNullOrEmpty(authentication.ErrorMessage))
                {
                    throw new Exception(authentication.ErrorMessage);
                }

                var user = authentication.User;

                var chat = await _dbContext.Chats.Include(c => c.Participants).FirstOrDefaultAsync(c => c.ID == model.chatID && c.Owner == user.ID);
                Console.WriteLine("Chat");
                if (chat == null)
                {
                    throw new Exception("Failed to fetch chat data");
                }

                var userFriendsIDs = await _dbContext.Friends.Include(f => f.Sender).Include(f => f.Receiver).Where(f => f.SenderID == user.ID || f.ReceiverID == user.ID).Select(f => f.SenderID == user.ID ? f.ReceiverID : f.SenderID).ToListAsync();

                var filteredUserIDs = model.ParticipantsID.Where(id => userFriendsIDs.Contains(id)).ToHashSet();
                filteredUserIDs.Add(user.ID);


                var currentParticipants = new HashSet<int>(chat.Participants.Select(p => p.UserID));
                var participantsToAdd = filteredUserIDs.Except(currentParticipants).ToList();
                var participantsToRemove = currentParticipants.Except(filteredUserIDs).ToList();
                var removedUsers = await _dbContext.ChatParticipants.Include(cp => cp.User).Where(cp => participantsToRemove.Contains(cp.UserID)).Select(cp => cp.User).ToListAsync();

                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {   
                    var newParticipants = participantsToAdd.Select(id => new ChatParticipant { ChatID = chat.ID, UserID = id }).ToList();
                    if ((newParticipants.Count + currentParticipants.Count - participantsToRemove.Count) < MIN_CHAT_SIZE)
                    {
                        throw new Exception("Chat is too small");
                    } 
                    await _dbContext.ChatParticipants.AddRangeAsync(newParticipants);

                    var participantsToRemoveEntities = await _dbContext.ChatParticipants
                                                                       .Where(cp => participantsToRemove.Contains(cp.UserID) && cp.ChatID == chat.ID)
                                                                       .ToListAsync();
                    _dbContext.ChatParticipants.RemoveRange(participantsToRemoveEntities);

                    chat.ChatName = model.ChatName;

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }

                var removedParticipants = await _dbContext.ChatParticipants.Include(cp => cp.User).Where(cp => cp.ChatID == chat.ID).Select(cp => cp.User).ToListAsync();

                var updatedParticipants = await _dbContext.ChatParticipants.Include(cp => cp.User).Where(cp => cp.ChatID == chat.ID).Select(cp => cp.User).ToListAsync();


                foreach (var u in removedUsers)
                {
                    var userChatList = await UserChatList(_dbContext, u);
                    await Clients.Group(u.Email).SendAsync("UserRemoved", new {
                        chatID = chat.ID,
                        userChatList= userChatList
                    });
                }

                foreach (var u in updatedParticipants)
                {
                    var userChatList = await UserChatList(_dbContext, u);
                    await Clients.Group(u.Email).SendAsync("EditChat", userChatList);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }


        // Messages
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
