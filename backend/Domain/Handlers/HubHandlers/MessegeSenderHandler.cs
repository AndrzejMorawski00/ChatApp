using MediatR;
using Domain.Models.HubModels;
using Microsoft.AspNetCore.SignalR;

namespace Domain.Handlers.HubHandlers
{
    public class MessageSenderNotification : INotification
    {
        public required IHubCallerClients HubClients { get; set; }
        public required string GroupName { get; set; }
        public required string EventName { get; set; }
        public required NotificationModel MessageData { get; set; }
    }

    public class MessageSenderNotificationHandler : INotificationHandler<MessageSenderNotification>
    {
        private readonly IMediator _mediator;

        public MessageSenderNotificationHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Handle(MessageSenderNotification notification, CancellationToken cancellationToken)
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
            await notification.HubClients.Group(notification.GroupName).SendAsync(notification.EventName, newMessageObject, cancellationToken);
        }
    }
}
