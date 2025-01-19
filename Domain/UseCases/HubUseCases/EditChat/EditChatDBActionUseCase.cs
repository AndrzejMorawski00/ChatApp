using Domain.Models.HubModels;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.HubUseCases.EditChat
{
    public class EditChatDBActionParameters : IRequest<EditChatDBActionResults>
    {
        public required EditChatModel model { get; set; }
        public required List<int> ParticipantsToAdd { get; set; }
        public required List<int> ParticipantsToRemove { get; set; }
        public required HashSet<int> CurrentParticipants { get; set; }
        public required HashSet<int> FilteredUserIDs { get; set; }
        public required Chat Chat { get; set; }
    }

    public class EditChatDBActionResults
    {
        public required List<UserData> RemovedParticipants { get; set; }
        public required List<UserData> UpdatedParticipants { get; set; }
        public required List<UserData> AddedParticipants { get; set; }
    }

    public class EditChatDBActionHandler : IRequestHandler<EditChatDBActionParameters, EditChatDBActionResults>
    {
        private readonly AppDBContext _dbContext;
        private readonly static int MIN_CHAT_SIZE = 1;
        public EditChatDBActionHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<EditChatDBActionResults> Handle(EditChatDBActionParameters request, CancellationToken cancellationToken)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var newParticipants = request.ParticipantsToAdd.Select(id => new ChatParticipant { ChatID = request.Chat.ID, UserID = id }).ToList();
                if ((newParticipants.Count + request.CurrentParticipants.Count - request.ParticipantsToRemove.Count) < MIN_CHAT_SIZE)
                {
                    throw new Exception("Chat is too small");
                }
                await _dbContext.ChatParticipants.AddRangeAsync(newParticipants);

                var participantsToRemoveEntities = await _dbContext.ChatParticipants
                                                                   .Where(cp => request.ParticipantsToRemove.Contains(cp.UserID) && cp.ChatID == request.Chat.ID)
                                                                   .ToListAsync();
                _dbContext.ChatParticipants.RemoveRange(participantsToRemoveEntities);

                request.Chat.ChatName = request.model.ChatName;

                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            var removedParticipants = await _dbContext.ChatParticipants.Include(cp => cp.User).Where(cp => cp.ChatID == request.Chat.ID).Select(cp => cp.User).ToListAsync();

            var updatedParticipants = await _dbContext.ChatParticipants.Include(cp => cp.User).Where(cp => cp.ChatID == request.Chat.ID && !request.ParticipantsToAdd.Contains(cp.UserID)).Select(cp => cp.User).ToListAsync();

            var addedParticipants = await _dbContext.ChatParticipants.Include(cp => cp.User).Where(cp => cp.ChatID == request.Chat.ID && request.ParticipantsToAdd.Contains(cp.UserID)).Select(cp => cp.User).ToListAsync();

            return new EditChatDBActionResults()
            {
                AddedParticipants = addedParticipants,
                RemovedParticipants = removedParticipants,
                UpdatedParticipants = updatedParticipants
            };
        }
    }
}
