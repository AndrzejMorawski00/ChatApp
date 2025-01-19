using Domain.Models.CommonModels;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

using static Domain.Utils;

namespace Domain.UseCases.HubUseCases.Common
{
    public class GenerateUserChatListResponseParameters : IRequest<GenerateUserChatListResponseResults>
    {
        public required UserData User { get; set; }
    }

    public class GenerateUserChatListResponseResults
    {
        public required List<ChatModel> UserResponse { get; set; }
    }

    public class GenerateUserChatListResponseHandler : IRequestHandler<GenerateUserChatListResponseParameters, GenerateUserChatListResponseResults>
    {
        private readonly AppDBContext _dbContext;

        public GenerateUserChatListResponseHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GenerateUserChatListResponseResults> Handle(GenerateUserChatListResponseParameters request, CancellationToken cancellationToken)
        {
            var userChats = await _dbContext.Chats
                .Include(c => c.Participants).ThenInclude(cp => cp.User)
                .Where(c => c.Participants.Any(p => p.UserID == request.User.ID))
                .Select(c => new ChatModel
                {
                    ID = c.ID,
                    ChatType = (int)c.ChatType,
                    ChatName = GetChatName(request.User, c),
                    Owner = c.Owner,
                    IsOwner = c.Owner == request.User.ID,
                    ChatParticipants = c.Participants.Select(p => new ChatParticipantModel
                    {
                        ID = p.UserID,
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName
                    })
                        .ToList()
                })
                .ToListAsync();

            return new GenerateUserChatListResponseResults() { UserResponse = userChats };
        }
    }
}

