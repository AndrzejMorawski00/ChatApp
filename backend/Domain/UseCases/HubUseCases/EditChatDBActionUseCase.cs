using Domain.Models.HubModels;
using Entities;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Domain.UseCases.HubUseCases
{
    public class EditChatDBActionParameters : IRequest<EditChatDBActionResults>
    {
        public required UserData User { get; set; }
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
        private const int MIN_CHAT_SIZE = 1;
        private const string ChatTooSmallErrorMessage = "Chat is too small";
        public EditChatDBActionHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<EditChatDBActionResults> Handle(EditChatDBActionParameters request, CancellationToken cancellationToken)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var newParticipants = request.ParticipantsToAdd
                    .Select(id => new ChatParticipant()
                    {
                        ChatID = request.Chat.ID,
                        UserID = id,
                        User=request.User,
                        Chat=request.Chat,
                    })
                    .ToList();

                if (newParticipants.Count + request.CurrentParticipants.Count - request.ParticipantsToRemove.Count < MIN_CHAT_SIZE)
                {
                    throw new Exception(ChatTooSmallErrorMessage);
                }

                if (newParticipants.Any())
                {
                    await _dbContext.ChatParticipants.AddRangeAsync(newParticipants);
                }

                var participantsToRemoveEntities = await _dbContext
                    .ChatParticipants
                    .Where(cp => request.ParticipantsToRemove.Contains(cp.UserID) && cp.ChatID == request.Chat.ID)
                    .ToListAsync();

                if (participantsToRemoveEntities.Any())
                {
                    _dbContext.ChatParticipants.RemoveRange(participantsToRemoveEntities);
                }
                if (request.model.ChatName != request.Chat.ChatName)
                {
                    request.Chat.ChatName = request.model.ChatName;
                }
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            var removedParticipants = await _dbContext.UserData
                                           .Where(u => request.ParticipantsToRemove.Contains(u.ID))
                                           .ToListAsync();

            var addedParticipants = await _dbContext.UserData
                                         .Where(u => request.ParticipantsToAdd.Contains(u.ID))
                                         .ToListAsync(cancellationToken);

            var updatedParticipants = new List<UserData>();

            if (request.model.ChatName != request.Chat.ChatName)
            {
                updatedParticipants = await _dbContext.ChatParticipants
                    .Where(cp => cp.ChatID == request.Chat.ID && !request.ParticipantsToAdd.Contains(cp.UserID))
                    .Select(cp => cp.User)
                    .ToListAsync();
            }

            updatedParticipants.Add(request.User);

            return new EditChatDBActionResults()
            {
                AddedParticipants = addedParticipants,
                RemovedParticipants = removedParticipants,
                UpdatedParticipants = updatedParticipants
            };
        }
    }
}
