using Infrastructure.DBContext;
using Entities;
using MediatR;

namespace Domain.UseCases.HubUseCases
{
    public class AcceptFriendshipParameters : IRequest<AcceptFriendshipResults>
    {
        public required UserData Sender { get; set; }
        public required UserData Receiver { get; set; }
        public required Friend Friendship { get; set; }
    }

    public class AcceptFriendshipResults
    {
        public required UserData Sender { get; set; }
        public required UserData Receiver { get; set; }
    }

    public class AcceptFriendshipHandler : IRequestHandler<AcceptFriendshipParameters, AcceptFriendshipResults>
    {
        private readonly AppDBContext _dbContext;

        public AcceptFriendshipHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<AcceptFriendshipResults> Handle(AcceptFriendshipParameters request, CancellationToken cancellationToken)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var newChat = new Chat
                {   
                    Owner = null,
                    ChatType = ChatType.DM,
                    ChatName = $"{request.Sender.FirstName} {request.Receiver.FirstName}",
                };
                await _dbContext.Chats.AddAsync(newChat);

                var p1 = new ChatParticipant
                {
                    Chat=newChat,
                    ChatID = newChat.ID,
                    UserID = request.Sender.ID,
                    User = request.Sender,
                };

                var p2 = new ChatParticipant
                {
                    Chat=newChat,
                    ChatID = newChat.ID,
                    UserID = request.Receiver.ID,
                    User = request.Receiver,    
                };
                newChat.Participants.Add(p1);
                newChat.Participants.Add(p2);
                request.Friendship.Status = FriendshipStatus.Accepted;
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return new AcceptFriendshipResults
                {
                    Sender = request.Sender,
                    Receiver = request.Receiver,
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
