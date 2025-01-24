using Domain.Models.HubModels;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;


namespace Domain.Handlers.HubHandlers
{
    public class ErrorNotification : INotification
    {
        public required IHubCallerClients HubClients { get; set; }
        public required HubCallerContext Context { get; set; }
        public required Exception ex { get; set; }
    }

    public class ErrorNotificationHandler : INotificationHandler<ErrorNotification>
    {
        private readonly IMediator _mediator;
        private const string InvalidEmailMessage = "Failed to send message to the user";
        private const string GenericErrorMessage = "Something went wrong...";
        private const string EventName = "MessageEvent";
        private const string ErrorMessageType = "error";

        public ErrorNotificationHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Handle(ErrorNotification notification, CancellationToken cancellationToken)
        {
            var userEmail = notification.Context?.User?.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                Console.WriteLine(InvalidEmailMessage);
                return;
            }

            var errorNotification = new MessageSenderNotification
            {
                HubClients = notification.HubClients,
                GroupName = userEmail,
                EventName = EventName,
                MessageData = new NotificationModel
                {
                    MessageType = ErrorMessageType,
                    MessageContent = GenericErrorMessage,
                    MessagePayload = null,
                }
            };
            await _mediator.Publish(errorNotification);
        }
    }
}


