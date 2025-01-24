using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using MediatR;
using Domain.UseCases.Common;
using Domain.Models.HubModels;
using Domain.UseCases.HubUseCases;
using Domain.Handlers.HubHandlers;


namespace ChatApp.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        // Messages
        private const string GenericErrorMessage = "Something went wrong...";
        private const string FriendshipAcceptedMessage = "Friendship has been accepted.";
        private const string FriendshipRequrestReceivedMessage = "New friendship request received";
        private const string FriendshipCanceledMessage = "Friendship has been cancelled.";
        private const string AddedToChatMessage = "You have been added to a chat.";
        private const string ChatCreatedMessage = "Chat Created Successfully.";
        private const string YouLeftChatMessage = "You left the chat.";
        private const string ChatDeletedMessage = "Chat has been deleted.";
        private const string ChatUpdatedMessage = "Chat has been updated.";
        private const string RemovedFromChatMessage = "You have been removed from a chat.";

        // SignalR Events
        private const string ConnectedEvent = "Connected";
        private const string FriendshipRequestReceivedEvent = "FriendshipRequestReceived";
        private const string FriendshipAcceptedEvent = "FriendshipAccepted";
        private const string FriendshipCancelledEvent = "FriendshipCancelled";
        private const string AddedToChatEvent = "AddedToChat";
        private const string EditChatEvent = "EditChat";
        private const string ChatDeletedEvent = "ChatDeleted";
        private const string UserRemovedEvent = "UserRemoved";
        private const string MessageSentEvent = "MessageSent";

        // Message Types
        private const string InfoMessageType = "info";
        private const string ErrorMessageType = "error";
        private const string SuccessMessageType = "success";


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
                    await Clients.Groups(userEmail).SendAsync(ConnectedEvent);
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
                var authentication = await _mediator.Send(new AuthenticateHubParameters
                {
                    Context = Context
                });
                var user = authentication.User;

                var newFriendship = await _mediator.Send(
                    new CreateFriendshipUseCaseParameters
                    {
                        FriendEmail = friendEmail,
                        UserEmail = user.Email
                    });

                var userUnrelatedUsers = await _mediator.Send(new GetUserListResponseParameters
                {
                    User = user,
                    SearchParameter = "",
                });
                var userResponse = await _mediator.Send(new GenerateFriendshipResponseParameters
                {
                    User = user
                });
                var userNotification = new MessageSenderNotification
                {
                    HubClients = Clients,
                    GroupName = user.Email,
                    EventName = FriendshipRequestReceivedEvent,
                    MessageData = new NotificationModel
                    {
                        MessageType = null,
                        MessageContent = null,
                        MessagePayload = new UserFriendshipResponseModel
                        {
                            Users = userUnrelatedUsers.Users,
                            Friendships = userResponse.FriendshipResponseModel
                        }
                    }
                };

                var friendUnrelatedUsers = await _mediator.Send(new GetUserListResponseParameters
                {
                    User = newFriendship.Friend,
                    SearchParameter = ""
                });
                var friendResponse = await _mediator.Send(new GenerateFriendshipResponseParameters
                {
                    User = newFriendship.Friend
                });
                var friendNotification = new MessageSenderNotification
                {
                    HubClients = Clients,
                    GroupName = newFriendship.Friend.Email,
                    EventName = FriendshipRequestReceivedEvent,
                    MessageData = new NotificationModel
                    {
                        MessageType = InfoMessageType,
                        MessageContent = FriendshipRequrestReceivedMessage,
                        MessagePayload = new UserFriendshipResponseModel
                        {
                            Users = friendUnrelatedUsers.Users,
                            Friendships = friendResponse.FriendshipResponseModel
                        }
                    }
                };

                await _mediator.Publish(userNotification);
                await _mediator.Publish(friendNotification);
            }
            catch (Exception ex)
            {
                await _mediator.Send(new ErrorNotification
                {
                    Context = Context,
                    HubClients = Clients,
                    ex = ex,
                });
            }
        }

        public async Task AcceptFriend(int friendshipID)
        {
            try
            {
                var data = await _mediator.Send(new ValidateFriendshipUseCaseParameters
                {
                    Context = Context,
                    friendshipID = friendshipID
                });

                var acceptedFriendship = await _mediator.Send(new AcceptFriendshipParameters
                {
                    Sender = data.Sender,
                    Receiver = data.Receiver,
                    Friendship = data.Friendship,
                });

                var acceptFriendSenderResponse = await _mediator.Send(new GenerateFriendshipResponseParameters
                {
                    User = data.Sender,
                });

                var acceptFriendReceiverResponse = await _mediator.Send(new GenerateFriendshipResponseParameters
                {
                    User = data.Sender,
                });

                var senderNotification = new MessageSenderNotification
                {
                    HubClients = Clients,
                    GroupName = data.Sender.Email,
                    EventName = FriendshipAcceptedEvent,
                    MessageData = new NotificationModel
                    {
                        MessageType = null,
                        MessageContent = null,
                        MessagePayload = acceptFriendSenderResponse.FriendshipResponseModel,
                    }
                };

                var receiverNotification = new MessageSenderNotification
                {
                    HubClients = Clients,
                    GroupName = data.Receiver.Email,
                    EventName = FriendshipAcceptedEvent,
                    MessageData = new NotificationModel
                    {
                        MessageContent = FriendshipAcceptedMessage,
                        MessageType = InfoMessageType,
                        MessagePayload = acceptFriendSenderResponse.FriendshipResponseModel,
                    }
                };

                await _mediator.Publish(senderNotification);
                await _mediator.Publish(receiverNotification);
            }
            catch (Exception ex)
            {
                await _mediator.Send(new ErrorNotification
                {
                    Context = Context,
                    HubClients = Clients,
                    ex = ex,
                });
            }
        }

        public async Task RemoveFriend(int friendshipID)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters
                {
                    Context = Context,
                });

                var friendshipResponse = await _mediator.Send(new RemoveFriendshipParameters
                {
                    FriendshipID = friendshipID,
                    User = authentication.User,
                });

                var userResponse = await _mediator.Send(new GenerateFriendshipResponseParameters
                {
                    User = authentication.User
                });
                var userUnrelatedUsers = await _mediator.Send(new GetUserListResponseParameters
                {
                    User = authentication.User,
                    SearchParameter = ""
                });

                var userNotification = new MessageSenderNotification
                {
                    HubClients = Clients,
                    GroupName = authentication.User.Email,
                    EventName = FriendshipCancelledEvent,
                    MessageData = new NotificationModel
                    {
                        MessageType = null,
                        MessageContent = null,
                        MessagePayload = new UserFriendshipResponseModel
                        {
                            Users = userUnrelatedUsers.Users,
                            Friendships = userResponse.FriendshipResponseModel
                        }
                    }
                };

                var friendResponse = await _mediator.Send(new GenerateFriendshipResponseParameters
                {
                    User = friendshipResponse.Friend
                });
                var friendUnrelatedUsers = await _mediator.Send(new GetUserListResponseParameters
                {
                    User = friendshipResponse.Friend,
                    SearchParameter = ""
                });
                var friendNotification = new MessageSenderNotification
                {
                    HubClients = Clients,
                    GroupName = friendshipResponse.Friend.Email,
                    EventName = FriendshipCancelledEvent,
                    MessageData = new NotificationModel
                    {
                        MessageType = InfoMessageType,
                        MessageContent = FriendshipCanceledMessage,
                        MessagePayload = new UserFriendshipResponseModel
                        {
                            Users = friendUnrelatedUsers.Users,
                            Friendships = friendResponse.FriendshipResponseModel
                        }
                    }
                };

                await _mediator.Publish(userNotification);
                await _mediator.Publish(friendNotification);
            }
            catch (Exception ex)
            {
                await _mediator.Send(new ErrorNotification
                {
                    Context = Context,
                    HubClients = Clients,
                    ex = ex,
                });
            }
        }

        public async Task CreateNewChat(NewChatModel model)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters
                {
                    Context = Context,
                });

                var newChatResponse = await _mediator.Send(new CreateNewChatParameters
                {
                    ChatName = model.ChatName,
                    ParticipantIDList = model.ParticipantsID,
                    User = authentication.User
                });

                var userResponse = await _mediator.Send(new GenerateUserChatListResponseParameters
                {
                    User = authentication.User
                });

                var newGroupMessage = new GroupMessageNotification
                {
                    HubClients = Clients,
                    GroupEventName = AddedToChatEvent,
                    ChatParticipants = newChatResponse.Users,
                    GroupMessage = new NotificationModel
                    {
                        MessageType = InfoMessageType,
                        MessageContent = AddedToChatMessage,
                        MessagePayload = null,
                    },
                    User = authentication.User,
                    UserEventName = EditChatEvent,
                    UserMessage = new NotificationModel
                    {
                        MessageType = SuccessMessageType,
                        MessageContent = ChatCreatedMessage,
                        MessagePayload = userResponse.UserResponse,
                    },
                };
            }
            catch (Exception ex)
            {
                await _mediator.Send(new ErrorNotification
                {
                    Context = Context,
                    HubClients = Clients,
                    ex = ex,
                });
            }
        }

        public async Task LeaveChat(int ChatID)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters
                {
                    Context = Context,
                });
                var leaveChatResults = await _mediator.Send(new LeaveChatParameters
                {
                    ChatID = ChatID,
                    User = authentication.User
                });

                var userResponse = await _mediator.Send(new UserChatListResponseParameters
                {
                    User = authentication.User
                });

                var chatOwnerResponse = await _mediator.Send(new UserChatListResponseParameters
                {
                    User = leaveChatResults.ChatOwner
                });

                var userNotification = new MessageSenderNotification
                {
                    HubClients = Clients,
                    GroupName = authentication.User.Email,
                    EventName = EditChatEvent,
                    MessageData = new NotificationModel
                    {
                        MessageType = SuccessMessageType,
                        MessageContent = YouLeftChatMessage,
                        MessagePayload = userResponse.ChatList,
                    }
                };
                var chatOwnerNotification = new MessageSenderNotification()
                {
                    HubClients = Clients,
                    GroupName = leaveChatResults.ChatOwner.Email,
                    EventName = EditChatEvent,
                    MessageData = new NotificationModel
                    {
                        MessageType = null,
                        MessageContent = null,
                        MessagePayload = chatOwnerResponse.ChatList,
                    }
                };

                await _mediator.Publish(userNotification);
                await _mediator.Publish(chatOwnerNotification);
            }
            catch (Exception ex)
            {
                await _mediator.Send(new ErrorNotification
                {
                    Context = Context,
                    HubClients = Clients,
                    ex = ex,
                });
            }
        }
        public async Task DeleteChat(int ChatID)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters
                {
                    Context = Context
                });

                var deleteChatResponse = await _mediator.Send(new DeleteChatParameters
                {
                    ChatID = ChatID,
                    User = authentication.User
                });

                var userResponse = await _mediator.Send(new GenerateUserChatListResponseParameters
                {
                    User = authentication.User
                });

                await _mediator.Publish(new GroupMessageNotification
                {
                    HubClients = Clients,
                    GroupEventName = ChatDeletedEvent,
                    ChatParticipants = deleteChatResponse.ChatParticipants,
                    GroupMessage = new NotificationModel
                    {
                        MessageType = InfoMessageType,
                        MessageContent = ChatDeletedMessage,
                        MessagePayload = null,
                    },
                    User = authentication.User,
                    UserEventName = ChatDeletedEvent,
                    UserMessage = new NotificationModel
                    {
                        MessageType = SuccessMessageType,
                        MessageContent = ChatDeletedMessage,
                        MessagePayload = new
                        {
                            chatID = ChatID,
                            UserChatList = userResponse.UserResponse
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                await _mediator.Send(new ErrorNotification
                {
                    Context = Context,
                    HubClients = Clients,
                    ex = ex,
                });
            }
        }

        public async Task EditChat([FromBody] EditChatModel model)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters
                {
                    Context = Context
                });

                var getChatData = await _mediator.Send(new GetEditChatParameters
                {
                    model = model,
                    User = authentication.User
                });

                var dbResponseData = await _mediator.Send(new EditChatDBActionParameters
                {
                    User = authentication.User,
                    Chat = getChatData.Chat,
                    CurrentParticipants = getChatData.CurrentParticipants,
                    FilteredUserIDs = getChatData.FilteredUserIDs,
                    model = model,
                    ParticipantsToAdd = getChatData.ParticipantsToAdd,
                    ParticipantsToRemove = getChatData.ParticipantsToRemove
                });

                //await _mediator.Publish(new NotifyUsersNotification()
                //{
                //    HubClients = Clients,
                //    ChatParticipants = dbResponseData.UpdatedParticipants,
                //    EventName = "EditChat",
                //    Message = "Chat has been updated.",
                //    MessageType = "info",
                //    //User = authentication.User 
                //});

                await _mediator.Publish(new GroupMessageNotification
                {
                    HubClients = Clients,
                    GroupEventName = EditChatEvent,
                    ChatParticipants = dbResponseData.UpdatedParticipants,
                    GroupMessage = new NotificationModel
                    {
                        MessageType = InfoMessageType,
                        MessageContent = ChatDeletedMessage,
                        MessagePayload = null,
                    },
                    User = null,
                    UserEventName = null,
                    UserMessage = null,
                });

                await _mediator.Publish(new GroupMessageNotification
                {
                    HubClients = Clients,
                    GroupEventName = AddedToChatEvent,
                    ChatParticipants = dbResponseData.AddedParticipants,
                    GroupMessage = new NotificationModel
                    {
                        MessageType = InfoMessageType,
                        MessageContent = AddedToChatMessage,
                        MessagePayload = null,
                    },
                    User = null,
                    UserEventName = null,
                    UserMessage = null,
                });

                await _mediator.Publish(new GroupMessageNotification
                {
                    HubClients = Clients,
                    GroupEventName = UserRemovedEvent,
                    ChatParticipants = dbResponseData.RemovedParticipants,
                    GroupMessage = new NotificationModel
                    {
                        MessageType = InfoMessageType,
                        MessageContent = RemovedFromChatMessage,
                        MessagePayload = null,
                    },
                    User = null,
                    UserEventName = null,
                    UserMessage = null,
                });
            }
            catch (Exception ex)
            {
                await _mediator.Send(new ErrorNotification
                {
                    Context = Context,
                    HubClients = Clients,
                    ex = ex,
                });
            }
        }

        // Messages
        public async Task JoinGroup(int groupID)
        {
            try
            {
                await _mediator.Publish(new JoinGroupNotification
                {
                    Context = Context,
                    ChatID = groupID,
                    Groups = Groups,
                });
            }
            catch (Exception ex)
            {
                await _mediator.Send(new ErrorNotification
                {
                    Context = Context,
                    HubClients = Clients,
                    ex = ex,
                });
            }
        }

        public async Task SendMessage([FromBody] NewMessageModel model)
        {
            try
            {
                var authentication = await _mediator.Send(new AuthenticateHubParameters
                {
                    Context = Context
                });
                var dbResponse = await _mediator.Send(new AddNewMessageParameters
                {
                    model = model,
                    User = authentication.User
                });

                var userResponse = await _mediator.Send(new GenerateNewMessageParameters
                {
                    IsOwner = true,
                    Message = dbResponse.Message
                });
                var chatResponse = await _mediator.Send(new GenerateNewMessageParameters
                {
                    IsOwner = false,
                    Message = dbResponse.Message
                });

                await _mediator.Publish(new MessageSenderNotification
                {
                    HubClients = Clients,
                    GroupName = authentication.User.Email,
                    EventName = MessageSentEvent,
                    MessageData = new NotificationModel
                    {
                        MessageType = null,
                        MessageContent = null,
                        MessagePayload = userResponse.ResponseMessage,
                    }
                });

                await _mediator.Publish(new NotifyGroupExceptUserNotification
                {
                    HubClients = Clients,
                    Context = Context,
                    GroupName = dbResponse.GroupName,
                    EventName = MessageSentEvent,
                    MessageData = new NotificationModel
                    {
                        MessageType = null,
                        MessageContent = null,
                        MessagePayload = chatResponse.ResponseMessage,
                    }
                });
            }
            catch (Exception ex)
            {
                await _mediator.Send(new ErrorNotification
                {
                    Context = Context,
                    HubClients = Clients,
                    ex = ex,
                });
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

