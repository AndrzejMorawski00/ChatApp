using Domain.Models.HubModels;
using Entities;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Domain.UseCases.HubUseCases
{
    public class GetEditChatParameters : IRequest<GetEditChatResults>
    {
        public required EditChatModel model { get; set; }
        public required UserData User { get; set; }
    }

    public class GetEditChatResults
    {
        public required List<int> ParticipantsToAdd { get; set; }
        public required List<int> ParticipantsToRemove { get; set; }

        public required HashSet<int> CurrentParticipants { get; set; }

        public required HashSet<int> FilteredUserIDs { get; set; }
        public required Chat Chat { get; set; }
    }



    public class GetEditChatHandler : IRequestHandler<GetEditChatParameters, GetEditChatResults>
    {
        private readonly AppDBContext _dbContext;

        private const string InvalidChatNameMessage = "Invalid chat name";
        private const string FetchChatDataFailedMessage = "Failed to fetch chat data";
        public GetEditChatHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GetEditChatResults> Handle(GetEditChatParameters request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.model.ChatName))
            {
                throw new Exception(InvalidChatNameMessage);
            }
            var model = request.model;
            var user = request.User;
            var chat = await _dbContext.Chats
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.ID == model.chatID && c.OwnerID == user.ID);
            if (chat == null)
            {
                throw new Exception(FetchChatDataFailedMessage);
            }

            var userFriendsIDs = await _dbContext.Friends
                .Include(f => f.Sender)
                .Include(f => f.Receiver)
                .Where(f => f.SenderID == user.ID || f.ReceiverID == user.ID)
                .Select(f => f.SenderID == user.ID ? f.ReceiverID : f.SenderID)
                .ToListAsync();

            var filteredUserIDs = model.ParticipantsID.Where(id => userFriendsIDs.Contains(id)).ToHashSet();
            filteredUserIDs.Add(user.ID);

            var currentParticipants = new HashSet<int>(chat.Participants.Select(p => p.UserID));
            var participantsToAdd = filteredUserIDs.Except(currentParticipants).ToList();
            var participantsToRemove = currentParticipants.Except(filteredUserIDs).ToList();

            return new GetEditChatResults()
            {
                Chat = chat,
                ParticipantsToAdd = participantsToAdd,
                ParticipantsToRemove = participantsToRemove,
                CurrentParticipants = currentParticipants,
                FilteredUserIDs = filteredUserIDs,
            };
        }
    }
}
