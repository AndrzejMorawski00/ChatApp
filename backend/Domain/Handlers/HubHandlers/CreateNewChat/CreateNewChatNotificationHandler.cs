using Domain.Handlers.HubHandlers.Common;
using Domain.UseCases.HubUseCases.Common;
using Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Domain.Handlers.HubHandlers
{
    public class CreateNewChatNotification : INotification
    {
        public required IHubCallerClients HubClients { get; set; }
        public required List<UserData> ChatParticipants { get; set; }
        public required UserData User { get; set; }
    }

    public class CreateNewChatNotificationHandler : INotificationHandler<CreateNewChatNotification>
    {
        private readonly IMediator _mediator;

        public CreateNewChatNotificationHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Handle(CreateNewChatNotification notification, CancellationToken cancellationToken)
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
                    HubClients=notification.HubClients,
                    GroupName = user.Email,
                    EventName = "AddedToChat",
                    Message = "You have been added to a chat.",
                    MessageType = "info",
                    MessagePayload = userResponse.UserResponse,
                };
                await _mediator.Publish(userNotification);
            }
        }
    }
}
