using Domain.Models.HubModels;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Domain.Handlers.HubHandlers
{
    public class NotifyGroupExceptUserNotification : INotification
    {
        public required IHubCallerClients HubClients { get; set; }
        public required HubCallerContext Context { get; set; }
        public required string GroupName { get; set; }
        public required string EventName { get; set; }
        public required NotificationModel MessageData { get; set; }
    }

    public class NotifyGroupExceptUserHandler : INotificationHandler<NotifyGroupExceptUserNotification>
    {
        private readonly IMediator _mediator;

        public NotifyGroupExceptUserHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Handle(NotifyGroupExceptUserNotification notification, CancellationToken cancellationToken)
        {
            var message = notification.MessageData;
            var newMessageObject = new ChatHubMessageModel<object?>
            {
                Message = string.IsNullOrEmpty(message.MessageContent) || string.IsNullOrEmpty(message.MessageType)
                     ? null
                     : new MessageData
                     {
                         Content = message.MessageContent,
                         Type = message.MessageType,
                     },
                Payload = message.MessagePayload
            };
            await notification.HubClients.GroupExcept(notification.GroupName, notification.Context.ConnectionId).SendAsync(notification.EventName, newMessageObject, cancellationToken);
        }
    }
}
