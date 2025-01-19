using Domain.Models;
using Domain.Models.CommonModels;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.Utils;

namespace Domain.UseCases.Common
{
    public class GenerateFriendshipResponseParameters : IRequest<GenerateFriendshipResponseResults>
    {
        public UserData User { get; set; }
    }

    public class GenerateFriendshipResponseResults
    {
        public Dictionary<string, List<FriendshipModel>> FriendshipResponseModel { get; set; }
    }

    public class GenerateFriendshipResponseHandler : IRequestHandler<GenerateFriendshipResponseParameters, GenerateFriendshipResponseResults>
    {
        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

        public GenerateFriendshipResponseHandler(AppDBContext dbContext, IMediator mediator)
        {
            _dbContext = dbContext;
            _mediator = mediator;
        }

        public async Task<GenerateFriendshipResponseResults> Handle(GenerateFriendshipResponseParameters request, CancellationToken cancellationToken)
        {
            var user = request.User;
            var relatedUsersQuery = _dbContext.Friends.Where(f => f.SenderID == user.ID || f.ReceiverID == user.ID);

            var friendshipModels = await relatedUsersQuery.Include(f => f.Sender).Include(f => f.Receiver).Select(f => new FriendshipModel
            {
                ID = f.ID,
                SenderID = f.SenderID,
                SenderData = new UserDataModel
                {
                    ID = f.Sender.ID,
                    Email = f.Sender.Email,
                    FirstName = f.Sender.FirstName,
                    LastName = f.Sender.LastName,
                },
                ReceiverID = f.ReceiverID,
                ReceiverData = new UserDataModel
                {
                    ID = f.Receiver.ID,
                    Email = f.Receiver.Email,
                    FirstName = f.Receiver.FirstName,
                    LastName = f.Receiver.LastName,
                },
                IsSender = f.SenderID == user.ID,
                Status = f.Status
            }).ToListAsync(cancellationToken);

            var userResponse = await _mediator.Send(new DivideFriendshipsResponseParameters() { Friendships = friendshipModels });

            return new GenerateFriendshipResponseResults
            {
                FriendshipResponseModel = userResponse.DividedFriendships,
            };
        }
    }
}
