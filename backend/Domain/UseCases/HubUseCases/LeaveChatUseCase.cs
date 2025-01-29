using MediatR;
using Entities;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
namespace Domain.UseCases.HubUseCases
{
    public class LeaveChatParameters : IRequest<LeaveChatResults>
    {
        public required int ChatID { get; set; }
        public required UserData User { get; set; }
    }

    public class LeaveChatResults
    {
        public required List<UserData> Users { get; set; }

        public required UserData ChatOwner { get; set; }
    }

    public class LeaveChatHandler : IRequestHandler<LeaveChatParameters, LeaveChatResults>
    {
        private readonly AppDBContext _dbContext;

        private const string FailedToFetchChat = "Failed to fetch chat.";
        private const string FailedToFetchParticipant = "Failed to fetch participant data.";
        private const string FailedToFetchChatOwner = "Failed to fetch chat owner.";

        public LeaveChatHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<LeaveChatResults> Handle(LeaveChatParameters request, CancellationToken cancellationToken)
        {

            var chat = await _dbContext.Chats
                .Include(c => c.Participants)
                .Include(c => c.Owner)
                .FirstOrDefaultAsync(c => c.ID == request.ChatID && c.ChatType != ChatType.DM);

            if (chat == null)
            {
                throw new Exception(FailedToFetchChat);
            }

            var participant = await _dbContext.ChatParticipants
                .FirstOrDefaultAsync(cp => cp.ChatID == request.ChatID && cp.UserID == request.User.ID);

            if (participant == null)
            {
                throw new Exception(FailedToFetchParticipant);
            }

            _dbContext.Remove(participant);
            await _dbContext.SaveChangesAsync();

            var users = chat.Participants.Where(cp => cp != null)
                .Select(p => p.User)
                .ToList();

            var chatOwner = users.FirstOrDefault(u => u != null && u.ID == chat.OwnerID);

            if (chatOwner == null)
            {
                throw new Exception(FailedToFetchChatOwner);
            }

            return new LeaveChatResults()
            {
                Users = users,
                ChatOwner = chatOwner,
            };
        }
    }
}
