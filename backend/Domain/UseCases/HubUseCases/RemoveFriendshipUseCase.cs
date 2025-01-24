using MediatR;
using Entities;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
namespace Domain.UseCases.HubUseCases
{
    public class RemoveFriendshipParameters : IRequest<RemoveFriendshipResults>
    {
        public required int FriendshipID { get; set; }
        public required UserData User { get; set; }
    }

    public class RemoveFriendshipResults
    {
        public required UserData Friend { get; set; }
    }

    public class RemoveFriendshipHandler : IRequestHandler<RemoveFriendshipParameters, RemoveFriendshipResults>
    {
        private readonly AppDBContext _dbContext;

        private const string FailedToFindFriendship = "Friendship not found.";
        private const string FailedToFindFriend = "Friend not found.";
        private const string FailedToRemoveFriendship = "Error while removing friendship: ";

        public RemoveFriendshipHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<RemoveFriendshipResults> Handle(RemoveFriendshipParameters request, CancellationToken cancellationToken)
        {
            var friendship = await _dbContext.Friends
                .Include(f => f.Sender)
                .Include(f => f.Receiver)
                .FirstOrDefaultAsync(f => f.ID == request
            .FriendshipID);

            if (friendship == null)
            {
                throw new Exception(FailedToFindFriendship);
            }

            var friend = friendship.SenderID == request.User.ID ? friendship.Receiver : friendship.Sender;

            if (friend == null)
            {
                throw new Exception(FailedToFindFriend);
            }

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                if (friendship.Status == FriendshipStatus.Accepted)
                {
                    var chat = await _dbContext.Chats
                        .Include(c => c.Participants)
                        .FirstOrDefaultAsync(c => c.ChatType == ChatType.DM
                                                   && c.Participants.Any(p => p.UserID == request.User.ID)
                                                   && c.Participants.Any(p => p.UserID == friend.ID));
                    if (chat != null)
                    {
                        _dbContext.Chats.Remove(chat);
                    }
                }
                _dbContext.Remove(friendship);
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception(FailedToRemoveFriendship + ex.Message, ex);
            }

            return new RemoveFriendshipResults
            {
                Friend = friend
            };

        }
    }
}
