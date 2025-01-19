using Domain.Models;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.HubUseCases.AcceptFriend
{
    public class ValidateFriendshipUseCaseParameters : IRequest<ValidateFriendshipUseCaseResults>
    {
        public HubCallerContext Context { get; set; }
        public int friendshipID { get; set; }
    }

    public class ValidateFriendshipUseCaseResults
    {
        public UserData Sender { get; set; }
        public UserData Receiver { get; set; }

        public Friend Friendship { get; set; }

    }

    public class ValidateFriendshipUseCaseHandler : IRequestHandler<ValidateFriendshipUseCaseParameters, ValidateFriendshipUseCaseResults>
    {
        private readonly AppDBContext _dbContext;

        public ValidateFriendshipUseCaseHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ValidateFriendshipUseCaseResults> Handle(ValidateFriendshipUseCaseParameters request, CancellationToken cancellationToken)
        {
            var senderEmail = request.Context.User.FindFirst(ClaimTypes.Email).Value;

            if (string.IsNullOrWhiteSpace(senderEmail))
            {
                throw new Exception("Failed to fetch sender data");
            }

            var sender = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == senderEmail);

            if (sender == null)
            {
                throw new Exception("Failed to fetch user data");
            }

            var friendship = await _dbContext.Friends.Include(f => f.Sender).Include(f => f.Receiver).FirstOrDefaultAsync(fr => fr.ID == request.friendshipID && (fr.SenderID == sender.ID || fr.ReceiverID == sender.ID));

            if (friendship == null)
            {
                throw new Exception("Failed to fetch friendship data");
            }

            var receiver = friendship.SenderID == sender.ID ? friendship.Receiver : friendship.Sender;

            if (sender == null || receiver == null)
            {
                throw new Exception("Failed to fetch user or sender data");
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
