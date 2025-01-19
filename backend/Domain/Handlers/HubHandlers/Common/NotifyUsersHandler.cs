using Domain.UseCases.HubUseCases.Common;
using Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.SignalR;


namespace Domain.Handlers.HubHandlers.Common
{
    public class NotifyUsersNotification : INotification
    {
        public required IHubCallerClients HubClients { get; set; }
        public required List<UserData> ChatParticipants { get; set; }
        public  UserData User { get; set; }
        public required string EventName { get; set; }
        public required string Message { get; set; }
        public required string MessageType { get; set; }
    }

    public class NotifyUsersNotificationHandler : INotificationHandler<NotifyUsersNotification>
    {
        private readonly IMediator _mediator;

        public NotifyUsersNotificationHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Handle(NotifyUsersNotification notification, CancellationToken cancellationToken)
        {
            foreach (var user in notification.ChatParticipants)
            {
                if (user == notification.User)
                {
                    continue;
                }
                var userResponse = await _mediator.Send(new GenerateUserChatListResponseParameters() { User = user });
                var userNotification = new UserNotification()
                {
                    HubClients = notification.HubClients,
                    GroupName = user.Email,
                    EventName = notification.EventName,
                    Message = notification.Message,
                    MessageType = notification.MessageType,
                    MessagePayload = userResponse.UserResponse,
                };
                await _mediator.Publish(userNotification);
            }
        }
    }
}
