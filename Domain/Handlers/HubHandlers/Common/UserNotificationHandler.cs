using Domain.Models.HubModels;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Domain.Handlers.HubHandlers.Common
{
    public class UserNotification : INotification
    {
        public required IHubCallerClients HubClients { get; set; }
        public required string GroupName { get; set; }
        public required string EventName { get; set; }
        public string? Message { get; set; }
        public string? MessageType { get; set; }
        public object? MessagePayload { get; set; }
    }

    public class UserNotificationHandler : INotificationHandler<UserNotification>
    {
        public async Task Handle(UserNotification notification, CancellationToken cancellationToken)
        {
            var newMessageObject = new ChatHubMessageModel<object?>
            {
                Message = string.IsNullOrEmpty(notification.Message) || string.IsNullOrEmpty(notification.MessageType)
                    ? null
                    : new MessageData
                    {
                        Content = notification.Message,
                        Type = notification.MessageType,
                    },
                Payload = notification.MessagePayload
            };

            await notification.HubClients.Group(notification.GroupName).SendAsync(notification.EventName, newMessageObject);
        }
    }
}
