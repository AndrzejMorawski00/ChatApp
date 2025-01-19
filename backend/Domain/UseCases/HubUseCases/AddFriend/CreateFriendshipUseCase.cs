using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.HubUseCases.AddFriend
{
    public class CreateFriendshipUseCaseParameters : IRequest<CreateFriendshipUseCaseResults>
    {
        public required string UserEmail { get; set; }
        public required string FriendEmail { get; set; }
    }

    public class CreateFriendshipUseCaseResults
    {
        public required Friend NewFriendship { get; set; }
        public required UserData Friend { get; set; }
    }

    public class CreateFriendshipUseCaseHandler : IRequestHandler<CreateFriendshipUseCaseParameters, CreateFriendshipUseCaseResults>
    {
        private readonly AppDBContext _dbContext;

        public CreateFriendshipUseCaseHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CreateFriendshipUseCaseResults> Handle(CreateFriendshipUseCaseParameters request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == request.UserEmail);
            var friend = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == request.FriendEmail);

            if (user == null || friend == null)
            {
                throw new Exception("Failed to fetch user or friend");
            }

            var friendshipExists = await _dbContext.Friends
                .FirstOrDefaultAsync(f => f.SenderID == user.ID && f.ReceiverID == friend.ID || f.SenderID == friend.ID && f.ReceiverID == user.ID);

            if (friendshipExists != null)
            {
                throw new Exception("Friendship already exists");
            }

            var newFriendship = new Friend
            {
                SenderID = user.ID,
                ReceiverID = friend.ID,
                Status = FriendshipStatus.Pending,
            };

            await _dbContext.AddAsync(newFriendship);
            await _dbContext.SaveChangesAsync();

            return new CreateFriendshipUseCaseResults { NewFriendship = newFriendship, Friend = friend };
        }
    }
}


