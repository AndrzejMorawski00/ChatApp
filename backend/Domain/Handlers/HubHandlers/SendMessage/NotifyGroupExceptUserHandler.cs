using Domain.Models.HubModels;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.SignalR;


namespace Domain.Handlers.HubHandlers.SendMessage
{
    public class NotifyGroupExceptUserNotification : INotification
    {
        public IHubCallerClients HubClients { get; set; }
        public required HubCallerContext Context { get; set; }
        public required string GroupName { get; set; }
        public required string EventName { get; set; }
        public string? Message { get; set; }
        public string? MessageType { get; set; }
        public object? MessagePayload { get; set; }



    }

    public class NotifyGroupExceptUserNotificationHandler : INotificationHandler<NotifyGroupExceptUserNotification>
    {
        private readonly IMediator _mediator;

        public NotifyGroupExceptUserNotificationHandler(IMediator mediator, AppDBContext dbContext)
        {
            _mediator = mediator;
        }

        public async Task Handle(NotifyGroupExceptUserNotification notification, CancellationToken cancellationToken)
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

            await notification.HubClients.GroupExcept(notification.GroupName, notification.Context.ConnectionId).SendAsync(notification.EventName, newMessageObject);
        }
    }
}
