using Entities;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace Domain.UseCases.HubUseCases
{
    public class ValidateFriendshipUseCaseParameters : IRequest<ValidateFriendshipUseCaseResults>
    {
        public required HubCallerContext Context { get; set; }
        public required int friendshipID { get; set; }
    }

    public class ValidateFriendshipUseCaseResults
    {
        public required UserData Sender { get; set; }
        public required UserData Receiver { get; set; }
        public required Friend Friendship { get; set; }
    }

    public class ValidateFriendshipUseCaseHandler : IRequestHandler<ValidateFriendshipUseCaseParameters, ValidateFriendshipUseCaseResults>
    {
        private readonly AppDBContext _dbContext;

        private const string FailedToFetchSenderData = "Failed to fetch sender data";
        private const string FailedToFetchUserData = "Failed to fetch user data";
        private const string FailedToFetchFriendshipData = "Failed to fetch friendship data";
        private const string FailedToFetchSenderOrReceiverData = "Failed to fetch user or sender data";

        public ValidateFriendshipUseCaseHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ValidateFriendshipUseCaseResults> Handle(ValidateFriendshipUseCaseParameters request, CancellationToken cancellationToken)
        {
            var senderEmail = request.Context?.User?
                .FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrWhiteSpace(senderEmail))
            {
                throw new Exception(FailedToFetchSenderData);
            }

            var sender = await _dbContext.UserData
                .FirstOrDefaultAsync(u => u.Email == senderEmail);

            if (sender == null)
            {
                throw new Exception(FailedToFetchUserData);
            }

            var friendship = await _dbContext.Friends
                .Include(f => f.Sender)
                .Include(f => f.Receiver)
                .FirstOrDefaultAsync(fr => fr.ID == request.friendshipID && (fr.SenderID == sender.ID || fr.ReceiverID == sender.ID));

            if (friendship == null)
            {
                throw new Exception(FailedToFetchFriendshipData);
            }

            var receiver = friendship.SenderID == sender.ID ? friendship.Receiver : friendship.Sender;

            if (sender == null || receiver == null)
            {
                throw new Exception(FailedToFetchSenderOrReceiverData);
            }

            return new ValidateFriendshipUseCaseResults
            {
                Friendship = friendship,
                Sender = sender,
                Receiver = receiver,
            };
        }
    }
}
