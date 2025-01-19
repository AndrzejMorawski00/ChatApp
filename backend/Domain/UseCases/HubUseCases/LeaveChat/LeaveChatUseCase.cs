using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.HubUseCases.LeaveChat
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

        public LeaveChatHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<LeaveChatResults> Handle(LeaveChatParameters request, CancellationToken cancellationToken)
        {

            var chat = await _dbContext.Chats
                .Include(c => c.Participants)
                .ThenInclude(cp => cp.User)
                .FirstOrDefaultAsync(c => c.ID == request.ChatID && c.ChatType != ChatType.DM);

            if (chat == null)
            {
                throw new Exception("Failed to fetch chat");
            }

            var participant = await _dbContext.ChatParticipants.FirstOrDefaultAsync(cp => cp.ChatID == request.ChatID && cp.UserID == request.User.ID);

            if (participant == null)
            {
                throw new Exception("Failed to fetch participant Data");
            }
            _dbContext.Remove(participant);
            await _dbContext.SaveChangesAsync();

            var users = chat.Participants.Select(p => p.User).ToList();

            var chatOwner = users.FirstOrDefault(u => u.ID == chat.Owner);

            if (chatOwner == null)
            {
                throw new Exception("Failed to fetch chat owner");
            }

            return new LeaveChatResults()
            {
                Users = users,
                ChatOwner = chatOwner,
            };
        }
    }
}
