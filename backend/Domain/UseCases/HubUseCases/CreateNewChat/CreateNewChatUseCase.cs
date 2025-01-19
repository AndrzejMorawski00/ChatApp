using Domain.Models;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.HubUseCases.CreateNewChat
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
        private static int MIN_CHAT_SIZE = 1;

        public CreateNewChatHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CreateNewChatResults> Handle(CreateNewChatParameters request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.ChatName) || request.ParticipantIDList.Count < MIN_CHAT_SIZE)
            {
                throw new Exception("Invalid chat data");
            }

            request.ParticipantIDList.Add(request.User.ID);
            var userIDSet = new HashSet<int>(request.ParticipantIDList);

            var users = await _dbContext.UserData.Where(u => userIDSet.Contains(u.ID)).ToListAsync();

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var newChat = new Chat
                {
                    ChatType = ChatType.Group,
                    ChatName = request.ChatName,
                    Owner = request.User.ID,
                };

                _dbContext.Add(newChat);
                var participants = users.Select(u => new ChatParticipant
                {
                    ChatID = newChat.ID,
                    UserID = u.ID,
                }).ToList();
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

            return new CreateNewChatResults() { Users = users };
        }
    }
}
