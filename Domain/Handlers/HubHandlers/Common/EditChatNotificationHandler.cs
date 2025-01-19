using Domain.Models.CommonModels;
using Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Domain.Handlers.HubHandlers.Common
{
    public class EditChatNotification : INotification
    {
        public required IHubCallerClients HubClients { get; set; }
        public required UserData User { get; set; }
        public required List<ChatModel> ChatList { get; set; }

    }

    public class EditChatNotificationHandler : INotificationHandler<EditChatNotification>
    {
        private readonly IMediator _mediator;

        public EditChatNotificationHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Handle(EditChatNotification notification, CancellationToken cancellationToken)
        {
            var userNotification = new UserNotification()
            {
                HubClients = notification.HubClients,
                GroupName = notification.User.Email,
                EventName="EditChat",
                Message = "Chat data changed.",
                MessageType = "info",
                MessagePayload =notification.ChatList,
                
            };
            await _mediator.Publish(userNotification);
        }
    }
}
