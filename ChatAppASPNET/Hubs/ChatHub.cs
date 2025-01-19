using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using MediatR;
using Domain.UseCases.Common;
using Domain.UseCases.HubUseCases.Common;
using Domain.UseCases.HubUseCases.AddFriend;
using Domain.UseCases.HubUseCases.AcceptFriend;
using Domain.UseCases.HubUseCases.RemoveFriend; 
using Domain.UseCases.HubUseCases.CreateNewChat;
using Domain.UseCases.HubUseCases.LeaveChat;
using Domain.Handlers.HubHandlers.Common;
using Domain.UseCases.HubUseCases.DeleteChat;
using Domain.UseCases.HubUseCases.EditChat;
using Domain.Handlers.HubHandlers.JoinGroup;
using Domain.UseCases.HubUseCases.SendMessage;
using Domain.Handlers.HubHandlers.SendMessage;
using Domain.Models.HubModels;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ChatAppASPNET.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly static int MIN_CHAT_SIZE = 1;
        private readonly IMediator _mediator;
        private static string GenericErrorMessage = "Something went wrong...";

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
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
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters() { Context = Context });

                var user = authentication.User;

                var newFriendship = await _mediator.Send(new CreateFriendshipUseCaseParameters() { FriendEmail = friendEmail, UserEmail = user.Email });
                var userUnrelatedUsers = await _mediator.Send(new GetUserListResponseParameters() { User = user });

                var userResponse = await _mediator.Send(new GenerateFriendshipResponseParameters() { User = user });

                var friendResponse = await _mediator.Send(new GenerateFriendshipResponseParameters() { User = newFriendship.Friend });
                var friendUnrelatedUsers = await _mediator.Send(new GetUserListResponseParameters() { User = newFriendship.Friend });

                var userNotification = new UserNotification()
                {
                    HubClients = Clients,
                    GroupName = user.Email,
                    EventName = "FriendshipRequestReceived",
                    MessagePayload = new UserFriendshipResponseModel()
                    {
                        Users = userUnrelatedUsers.Users,
                        Friendships = userResponse.FriendshipResponseModel
                    }
                };

                var friendNotification = new UserNotification()
                {
                    HubClients = Clients,
                    GroupName = newFriendship.Friend.Email,
                    EventName = "FriendshipRequestReceived",
                    Message = "New friendship request received",
                    MessageType = "info",
                    MessagePayload = new UserFriendshipResponseModel()
                    {
                        Users = friendUnrelatedUsers.Users,
                        Friendships = friendResponse.FriendshipResponseModel
                    }
                };

                await _mediator.Publish(userNotification);
                await _mediator.Publish(friendNotification);
            }
            catch (Exception ex)
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email).Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw;
                }
                var errorNotification = new ErrorNotification()
                {
                    HubClients = Clients,
                    GroupName = userEmail,
                    ex = ex,
                };

                await _mediator.Publish(errorNotification);
            }
        }

        public async Task AcceptFriend(int friendshipID)
        {
            try
            {
                var data = await _mediator.Send(new ValidateFriendshipUseCaseParameters()
                {
                    Context = Context,
                    friendshipID = friendshipID
                });

                var acceptedFriendship = await _mediator.Send(new AcceptFriendshipParameters()
                {
                    Sender = data.Sender,
                    Receiver = data.Receiver,
                    Friendship = data.Friendship,
                });

                var acceptFriendSenderResponse = await _mediator.Send(new GenerateFriendshipResponseParameters()
                {
                    User = data.Sender,
                });

                var acceptFriendReceiverResponse = await _mediator.Send(new GenerateFriendshipResponseParameters()
                {
                    User = data.Sender,
                });

                var senderNotification = new UserNotification()
                {
                    HubClients = Clients,
                    GroupName = data.Sender.Email,
                    EventName = "FriendshipAccepted",
                    MessagePayload = acceptFriendSenderResponse.FriendshipResponseModel,
                };

                var receiverNotification = new UserNotification()
                {
                    HubClients = Clients,
                    GroupName = data.Receiver.Email,
                    EventName = "FriendshipAccepted",
                    Message = "Friendship has been accepted.",
                    MessageType = "info",
                    MessagePayload = acceptFriendSenderResponse.FriendshipResponseModel,
                };

                await _mediator.Publish(senderNotification);
                await _mediator.Publish(receiverNotification);
            }
            catch (Exception ex)
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email).Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw;
                }
                var errorNotification = new ErrorNotification()
                {
                    HubClients = Clients,
                    GroupName = userEmail,
                    ex = ex,
                };
                await _mediator.Publish(errorNotification);
            }
        }

        public async Task RemoveFriend(int friendshipID)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters()
                {
                    Context = Context,
                });

                var friendshipResponse = await _mediator.Send(new RemoveFriendshipParameters()
                {
                    FriendshipID = friendshipID,
                    User = authentication.User,
                });

                var userResponse = await _mediator.Send(new GenerateFriendshipResponseParameters() { User = authentication.User });
                var userUnrelatedUsers = await _mediator.Send(new GetUserListResponseParameters() { User = authentication.User });

                var friendResponse = await _mediator.Send(new GenerateFriendshipResponseParameters() { User = friendshipResponse.Friend });
                var friendUnrelatedUsers = await _mediator.Send(new GetUserListResponseParameters() { User = friendshipResponse.Friend });

                var userNotification = new UserNotification()
                {
                    HubClients = Clients,
                    GroupName = authentication.User.Email,
                    EventName = "FriendshipCancelled",
                    MessagePayload = new UserFriendshipResponseModel()
                    {
                        Users = userUnrelatedUsers.Users,
                        Friendships = userResponse.FriendshipResponseModel,
                    }
                };

                var friendNotification = new UserNotification()
                {
                    HubClients = Clients,
                    GroupName = friendshipResponse.Friend.Email,
                    EventName = "FriendshipCancelled",
                    Message = "Friendship has been cancelled.",
                    MessageType = "info",
                    MessagePayload = new UserFriendshipResponseModel()
                    {
                        Users = friendUnrelatedUsers.Users,
                        Friendships = friendResponse.FriendshipResponseModel
                    }
                };

                await _mediator.Publish(userNotification);
                await _mediator.Publish(friendNotification);
            }
            catch (Exception ex)
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email).Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw;
                }
                var errorNotification = new ErrorNotification()
                {
                    HubClients = Clients,
                    GroupName = userEmail,
                    ex = ex,
                };
                await _mediator.Publish(errorNotification);
            }
        }

        public async Task CreateNewChat(NewChatModel model)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters()
                {
                    Context = Context,
                });

                var newChatResponse = await _mediator.Send(new CreateNewChatParameters() { ChatName = model.ChatName, ParticipantIDList = model.ParticipantsID, User = authentication.User });

                var userResponse = await _mediator.Send(new GenerateUserChatListResponseParameters() { User = authentication.User });

                await _mediator.Publish(new UserNotification()
                {
                    EventName = "EditChat",
                    GroupName = authentication.User.Email,
                    HubClients = Clients,
                    Message = "Chat Created Successfully.",
                    MessageType = "success",
                    MessagePayload = userResponse.UserResponse
                });

                await _mediator.Publish(new NotifyUsersNotification()
                {
                    HubClients = Clients,
                    ChatParticipants = newChatResponse.Users,
                    User = authentication.User,
                    EventName = "AddedToChat",
                    Message = "You have been added to a chat.",
                    MessageType = "info",
                });
            }
            catch (Exception ex)
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email).Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw;
                }
                var errorNotification = new ErrorNotification()
                {
                    HubClients = Clients,
                    GroupName = userEmail,
                    ex = ex,
                };
                await _mediator.Publish(errorNotification);
            }
        }

        public async Task LeaveChat(int ChatID)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters() { Context = Context, });
                var leaveChatResults = await _mediator.Send(new LeaveChatParameters() { ChatID = ChatID, User = authentication.User });

                var userResponse = await _mediator.Send(new UserChatListResponseParameters() { User = authentication.User });

                await _mediator.Publish(new EditChatNotification()
                {
                    HubClients = Clients,
                    User = authentication.User,
                    ChatList = userResponse.ChatList,
                });
            }
            catch (Exception ex)
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email).Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw;
                }
                var errorNotification = new ErrorNotification()
                {
                    HubClients = Clients,
                    GroupName = userEmail,
                    ex = ex,
                };
                await _mediator.Publish(errorNotification);
            }
        }
        public async Task DeleteChat(int ChatID)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters() { Context = Context });

                var deleteChatResponse = await _mediator.Send(new DeleteChatParameters() { ChatID = ChatID, User = authentication.User });

                var userResponse = await _mediator.Send(new GenerateUserChatListResponseParameters() { User = authentication.User });

                await _mediator.Publish(new UserNotification()
                {
                    EventName = "ChatDeleted",
                    GroupName = authentication.User.Email,
                    HubClients = Clients,
                    Message = "Chat has been deleted.",
                    MessageType = "success",
                    MessagePayload = new
                    {
                        chatID= ChatID,
                        UserChatList= userResponse.UserResponse
                    }
                });

                await _mediator.Publish(new NotifyUsersNotification()
                {
                    HubClients = Clients,
                    User = authentication.User,
                    ChatParticipants = deleteChatResponse.ChatParticipants,
                    EventName = "ChatDeleted",
                    Message = "Chat has been deleted.",
                    MessageType = "info"
                });
            }
            catch (Exception ex)
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email).Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw;
                }
                var errorNotification = new ErrorNotification()
                {
                    HubClients = Clients,
                    GroupName = userEmail,
                    ex = ex,
                };
                await _mediator.Publish(errorNotification);
            }
        }

        public async Task EditChat([FromBody] EditChatModel model)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters() { Context = Context });
                var getChatData = await _mediator.Send(new GetEditChatParameters() { model = model, User = authentication.User });
                var dbResponseData = await _mediator.Send(new EditChatDBActionParameters() { Chat = getChatData.Chat, CurrentParticipants = getChatData.CurrentParticipants, FilteredUserIDs = getChatData.FilteredUserIDs, model = model, ParticipantsToAdd = getChatData.ParticipantsToAdd, ParticipantsToRemove = getChatData.ParticipantsToRemove });

                await _mediator.Publish(new NotifyUsersNotification() { HubClients = Clients, ChatParticipants = dbResponseData.UpdatedParticipants, EventName = "EditChat", Message = "Chat has been updated.", MessageType = "info", User = authentication.User });

                await _mediator.Publish(new NotifyUsersNotification() { HubClients = Clients, ChatParticipants = dbResponseData.AddedParticipants, EventName = "AddedToChat", Message = "info", MessageType = "You have been added to a chat.", User = authentication.User });

                await _mediator.Publish(new NotifyUsersNotification() { HubClients = Clients, ChatParticipants = dbResponseData.RemovedParticipants, EventName = "UserRemoved", Message = "You have been removed from a chat.", MessageType = "info", User = authentication.User });
            }
            catch (Exception ex)
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email).Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw;
                }
                var errorNotification = new ErrorNotification()
                {
                    HubClients = Clients,
                    GroupName = userEmail,
                    ex = ex,
                };
                await _mediator.Publish(errorNotification);
            }
        }

        // Messages
        public async Task JoinGroup(int groupID)
        {
            try
            {
                await _mediator.Publish(new JoinGroupNotification()
                {
                    Context = Context,
                    ChatID = groupID,
                    Groups = Groups,
                });
            }
            catch (Exception ex)
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email).Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw;
                }
                var errorNotification = new ErrorNotification()
                {
                    HubClients = Clients,
                    GroupName = userEmail,
                    ex = ex,
                };
                await _mediator.Publish(errorNotification);
            }
        }

        public async Task SendMessage([FromBody] NewMessageModel model)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters() { Context = Context });
                var dbResponse = await _mediator.Send(new AddNewMessageParameters() { model = model, User = authentication.User });

                var userResponse = await _mediator.Send(new GenerateNewMessageParameters() { IsOwner = true, Message = dbResponse.Message });
                var chatResponse = await _mediator.Send(new GenerateNewMessageParameters() { IsOwner = false, Message = dbResponse.Message });

                await _mediator.Publish(new UserNotification()
                {
                    EventName = "MessageSent",
                    GroupName = authentication.User.Email,
                    HubClients = Clients,
                    MessagePayload = userResponse.ResponseMessage,
                });

                await _mediator.Publish(new NotifyGroupExceptUserNotification()
                {
                    HubClients = Clients,
                    Context = Context,
                    GroupName = dbResponse.GroupName,
                    EventName = "MessageSent",
                    MessagePayload = chatResponse
                });
            }
            catch (Exception ex)
            {
                var userEmail = Context.User.FindFirst(ClaimTypes.Email).Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    throw;
                }
                var errorNotification = new ErrorNotification()
                {
                    HubClients = Clients,
                    GroupName = userEmail,
                    ex = ex,
                };
                await _mediator.Publish(errorNotification);
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

