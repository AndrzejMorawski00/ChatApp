using MediatR;
using Microsoft.AspNetCore.SignalR;


namespace Domain.Handlers.HubHandlers.Common
{
    public class ErrorNotification : INotification
    {
        public IHubCallerClients HubClients { get; set; }
        public required string GroupName { get; set; }
        public Exception ex { get; set; }
    }

    public class ErrorNotificationHandler : INotificationHandler<ErrorNotification>
    {
        private readonly IMediator _mediator;
        private static string GenericErrorMessage = "Something went wrong...";
        private static string EventName = "MessageEvent";

        public ErrorNotificationHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Handle(ErrorNotification notification, CancellationToken cancellationToken)
        {
            var errorNotification = new UserNotification()
            {
                HubClients = notification.HubClients,
                GroupName = notification.GroupName,
                EventName = EventName,
                Message = GenericErrorMessage,
                MessageType = "error"
            };

            await _mediator.Publish(errorNotification);
        }
    }
}


