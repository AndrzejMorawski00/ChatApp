using Infrastructure.DBContext;
using Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Domain.UseCases.HubUseCases
{
    public class CreateNewChatParameters : IRequest<CreateNewChatResults>
    {
        public required UserData User { get; set; }
        public required string ChatName { get; set; }
        public required List<int> ParticipantIDList { get; set; }
    }

    public class CreateNewChatResults
    {
        public required List<UserData> Users { get; set; }
    }

    public class CreateNewChatHandler : IRequestHandler<CreateNewChatParameters, CreateNewChatResults>
    {
        private readonly AppDBContext _dbContext;
        private const int MIN_CHAT_SIZE = 1;
        private const string InvalidChatDataError = "Invalid chat data";

        public CreateNewChatHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CreateNewChatResults> Handle(CreateNewChatParameters request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.ChatName) || request.ParticipantIDList.Count < MIN_CHAT_SIZE)
            {
                throw new Exception(InvalidChatDataError);
            }

            request.ParticipantIDList.Add(request.User.ID);
            var userIDSet = new HashSet<int>(request.ParticipantIDList);

            var users = await _dbContext.UserData
                .Where(u => userIDSet.Contains(u.ID))
                .ToListAsync();

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var newChat = new Chat
                {
                    Owner = request.User,
                    ChatType = ChatType.Group,
                    ChatName = request.ChatName,
                    OwnerID = request.User.ID,
                };

                _dbContext.Add(newChat);
                var participants = users
                    .Select(u => new ChatParticipant
                    {
                        Chat = newChat,
                        ChatID = newChat.ID,
                        UserID = u.ID,
                        User = u,
                    })
                    .ToList();

                _dbContext.ChatParticipants.AddRange(participants);

                newChat.Participants = participants;
                await _dbContext.SaveChangesAsync();
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            return new CreateNewChatResults
            {
                Users = users
            };
        }
    }
}
