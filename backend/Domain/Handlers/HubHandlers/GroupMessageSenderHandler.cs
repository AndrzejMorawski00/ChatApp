using Domain.Models.HubModels;
using Domain.UseCases.HubUseCases;
using Entities;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Domain.Handlers.HubHandlers
{
    public class GroupMessageNotification : INotification
    {
        public required IHubCallerClients HubClients { get; set; }
        public required string GroupEventName { get; set; }
        public required List<UserData> ChatParticipants { get; set; }
        public required NotificationModel GroupMessage { get; set; }

        public required string? UserEventName { get; set; }
        public required UserData? User { get; set; }
        public required NotificationModel? UserMessage { get; set; }
    }

    public class GroupMessageNotificationHandler : INotificationHandler<GroupMessageNotification>
    {
        private readonly IMediator _mediator;

        public GroupMessageNotificationHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Handle(GroupMessageNotification notification, CancellationToken cancellationToken)
        {
            foreach (var user in notification.ChatParticipants)
            {
                if (notification.User != null
                    && user == notification.User
                    && !string.IsNullOrEmpty(notification.UserEventName)
                    && notification.UserMessage != null)
                {
                    await _mediator.Send(new MessageSenderNotification
                    {
                        HubClients = notification.HubClients,
                        GroupName = notification.User.Email,
                        EventName = notification.UserEventName,
                        MessageData = notification.UserMessage,
                    });
                }
                else
                {
                    if (notification.GroupMessage.MessagePayload == null)
                    {
                        var newMessageData = await _mediator.Send(new GenerateUserChatListResponseParameters() { User = user });
                        notification.GroupMessage.MessagePayload = newMessageData.UserResponse;
                    }

                    await _mediator.Send(new MessageSenderNotification
                    {
                        HubClients = notification.HubClients,
                        GroupName = user.Email,
                        EventName = notification.GroupEventName,
                        MessageData = notification.GroupMessage,
                    });
                }
            }
        }
    }
}


