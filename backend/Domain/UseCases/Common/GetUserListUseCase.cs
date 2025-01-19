using Domain.Models.CommonModels;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Domain.UseCases.Common
{

    public class GetUserListResponseParameters : IRequest<GetUserListResponseResults>
    {
        public required UserData User { get; set; }
        public string? SearchParameter { get; set; }
    }

    public class GetUserListResponseResults
    {
        public required List<UserDataModel> Users { get; set; }
    }

    public class GetUserListResponseHandler : IRequestHandler<GetUserListResponseParameters, GetUserListResponseResults>
    {
        private readonly AppDBContext _dbContext;

        public GetUserListResponseHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GetUserListResponseResults> Handle(GetUserListResponseParameters request, CancellationToken cancellationToken)
        {
            var relatedUsers = await _dbContext.Friends.Where(f => f.SenderID == request.User.ID || f.ReceiverID == request.User.ID).Select(f => f.SenderID == request.User.ID ? f.ReceiverID : f.SenderID).ToListAsync();

            var unrealtedUsersQuery = _dbContext.UserData.Where(u => !relatedUsers.Contains(u.ID) && u.ID != request.User.ID);

            var searchParameter = request.SearchParameter;

            if (!string.IsNullOrEmpty(searchParameter))
            {
                unrealtedUsersQuery  = unrealtedUsersQuery.Where(u =>
                    u.FirstName.Contains(searchParameter) ||
                    u.LastName.Contains(searchParameter) ||
                    u.Email.Contains(searchParameter));
            }

            var unrelatedUsers = await unrealtedUsersQuery.Select(u => new UserDataModel()
            {
                ID = u.ID,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,

            }).ToListAsync();

            return new GetUserListResponseResults() { Users = unrelatedUsers };
        }


    }
}
