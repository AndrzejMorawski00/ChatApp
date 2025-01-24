using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;


namespace Domain.Handlers.HubHandlers
{
    public class JoinGroupNotification : INotification
    {
        public required IGroupManager Groups { get; set; }
        public required HubCallerContext Context { get; set; }
        public required int ChatID { get; set; }
    }

    public class JoinGroupNotificationHandler : INotificationHandler<JoinGroupNotification>
    {
        private readonly IMediator _mediator;
        private readonly AppDBContext _dbContext;

        private const string FailedToJoinGroupMessage = "Failed to join to a group";

        public JoinGroupNotificationHandler(IMediator mediator, AppDBContext dbContext)
        {
            _mediator = mediator;
            _dbContext = dbContext;
        }

        public async Task Handle(JoinGroupNotification notification, CancellationToken cancellationToken)
        {
            var chat = await _dbContext.Chats
                .FirstOrDefaultAsync(c => c.ID == notification.ChatID);

            if (chat == null)
            {
                throw new Exception(FailedToJoinGroupMessage);
            }

            var groupName = $"{chat.ChatName}_{chat.ID}";
            await notification.Groups.AddToGroupAsync(notification.Context.ConnectionId, groupName);
        }
    }
}
