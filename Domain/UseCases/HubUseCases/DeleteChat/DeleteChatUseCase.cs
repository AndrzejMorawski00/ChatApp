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

namespace Domain.UseCases.HubUseCases.DeleteChat
{
    public class DeleteChatParameters : IRequest<DeleteChatResults>
    {
        public required int ChatID { get; set; } 
        public required UserData User {  get; set; }    
    }

    public class DeleteChatResults
    {
        public required List<UserData> ChatParticipants { get; set; }
    }

    public class DeleteChatHandler : IRequestHandler<DeleteChatParameters, DeleteChatResults>
    {
        private readonly AppDBContext _dbContext;

        public DeleteChatHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DeleteChatResults> Handle(DeleteChatParameters request, CancellationToken cancellationToken)
        {

            var chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ID == request.ChatID && c.Owner == request.User.ID);
            if (chat == null)
            {
                throw new Exception("Failed to fetch chat");
            }

            var messages = _dbContext.Messages.Where(m => m.ChatID == request.ChatID).ToList();
            var chatParticipants = _dbContext.ChatParticipants.Include(c => c.User).Where(c => c.ChatID == request.ChatID).ToList();
            var users = chatParticipants.Select(c => c.User).ToList();

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {

                _dbContext.Messages.RemoveRange(messages);
                _dbContext.ChatParticipants.RemoveRange(chatParticipants);
                _dbContext.Chats.Remove(chat);
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            return new DeleteChatResults() { ChatParticipants = users };
        }
    }
}
