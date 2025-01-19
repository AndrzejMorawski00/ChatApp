using Domain.Handlers.HubHandlers.Common;
using Domain.UseCases.HubUseCases.Common;
using Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Domain.Handlers.HubHandlers.DeleteChat
{
    public class DeleteChatNotification : INotification
    {
        public required IHubCallerClients HubClients { get; set; }
        public required List<UserData> ChatParticipants { get; set; }
        public required UserData User { get; set; }
    }

    public class DeleteChatNotificationHandler : INotificationHandler<DeleteChatNotification>
    {
        private readonly IMediator _mediator;

        public DeleteChatNotificationHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Handle(DeleteChatNotification notification, CancellationToken cancellationToken)
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
                    EventName = "ChatDeleted",
                    Message = "Chat has been deleted.",
                    MessageType = "info",
                    MessagePayload = userResponse.UserResponse,
                };
                await _mediator.Publish(userNotification);
            }
        }
    }
}
