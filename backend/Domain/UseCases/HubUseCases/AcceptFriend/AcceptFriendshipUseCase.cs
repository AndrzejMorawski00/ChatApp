using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.HubUseCases.AcceptFriend
{
    public class AcceptFriendshipParameters : IRequest<AcceptFriendshipResults>
    {
        public UserData Sender { get; set; }
        public UserData Receiver { get; set; }

        public Friend Friendship { get; set; }

    }

    public class AcceptFriendshipResults
    {
        public UserData Sender { get; set; }
        public UserData Receiver { get; set; }

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
                    ChatType = ChatType.DM,
                    ChatName = $"{request.Sender.FirstName} {request.Receiver.FirstName}",
                };
                await _dbContext.Chats.AddAsync(newChat);

                var p1 = new ChatParticipant
                {
                    ChatID = newChat.ID,
                    UserID = request.Sender.ID,
                };

                var p2 = new ChatParticipant
                {
                    ChatID = newChat.ID,
                    UserID = request.Receiver.ID,
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
