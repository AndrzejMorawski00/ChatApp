using Domain.Models.CommonModels;
using Infrastructure.DBContext;
using Entities;
using MediatR;

namespace Domain.UseCases.Common
{
    public class DivideFriendshipsResponseParameters : IRequest<DivideFriendshipsResponseResults>
    {
        public required List<FriendshipModel> Friendships { get; set; }
    }

    public class DivideFriendshipsResponseResults
    {
        public required Dictionary<string, List<FriendshipModel>> DividedFriendships { get; set; }
    }

    public class DivideFriendshipsResponseHandler : IRequestHandler<DivideFriendshipsResponseParameters, DivideFriendshipsResponseResults>
    {
        private readonly AppDBContext _dbContext;

        public DivideFriendshipsResponseHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DivideFriendshipsResponseResults> Handle(DivideFriendshipsResponseParameters request, CancellationToken cancellationToken)
        {
            var friendshipResponse = new Dictionary<string, List<FriendshipModel>>()
            {
                { "accepted", new List<FriendshipModel>() },
                { "sent", new List<FriendshipModel>() },
                { "received", new List<FriendshipModel>() }
            };

            foreach (var friendship in request.Friendships)
            {
                if (friendship.Status == FriendshipStatus.Accepted)
                {
                    friendshipResponse["accepted"].Add(friendship);
                }
                else if (friendship.Status != FriendshipStatus.Accepted && friendship.IsSender)
                {
                    friendshipResponse["sent"].Add(friendship);
                }
                else if (friendship.Status != FriendshipStatus.Accepted && !friendship.IsSender)
                {
                    friendshipResponse["received"].Add(friendship);
                }
            }
            return new DivideFriendshipsResponseResults
            {
                DividedFriendships = friendshipResponse
            };
        }


    }
}
