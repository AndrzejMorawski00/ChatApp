using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.HubUseCases.RemoveFriend
{
    public class RemoveFriendshipParameters : IRequest<RemoveFriendshipResults>
    {
        public int FriendshipID { get; set; }
        public UserData User { get; set; }
    }

    public class RemoveFriendshipResults
    {
        public UserData Friend { get; set; }
    }

    public class RemoveFriendshipHandler : IRequestHandler<RemoveFriendshipParameters, RemoveFriendshipResults>
    {
        private readonly AppDBContext _dbContext;

        public RemoveFriendshipHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<RemoveFriendshipResults> Handle(RemoveFriendshipParameters request, CancellationToken cancellationToken)
        {
            var friendship = await _dbContext.Friends.Include(f => f.Sender).Include(f => f.Receiver).FirstOrDefaultAsync(f => f.ID == request
            .FriendshipID);

            if (friendship == null)
            {
                throw new Exception("Failed to fetch friendship data");
            }

            var friend = friendship.SenderID == request.User.ID ? friendship.Receiver : friendship.Sender;

            if (friend == null)
            {
                throw new Exception("Failed to fetch friend data");
            }

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {

                if (friendship.Status == FriendshipStatus.Accepted)
                {
                    var chat = await _dbContext.Chats.Include(c => c.Participants)
                            .FirstOrDefaultAsync(c => c.ChatType == ChatType.DM
                                                   && c.Participants.Any(p => p.UserID == request.User.ID)
                                                   && c.Participants.Any(p => p.UserID == friend.ID));

                    if (chat != null)
                    {
                        var chatParticipants = chat.Participants.Where(p => p.UserID == request.User.ID || p.UserID == friend.ID).ToList();
                        var messages = _dbContext.Messages.Where(m => m.ChatID == chat.ID).ToList();
                        _dbContext.Messages.RemoveRange(messages);
                        _dbContext.ChatParticipants.RemoveRange(chatParticipants);
                        _dbContext.Chats.Remove(chat);

                    }
                }
                _dbContext.Remove(friendship);
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }

            return new RemoveFriendshipResults()
            {
                Friend = friend
            };

        }
    }
}
