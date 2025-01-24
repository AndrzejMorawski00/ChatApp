using Infrastructure.DBContext;
using Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Domain.UseCases.APIUseCases
{
    public class GetUserModelParameters : IRequest<GetUserModelResults>
    {
        public required string UserEmail { get; set; }
    }

    public class GetUserModelResults
    {
        public required UserData User { get; set; }
    }

    public class GetUserModelHandler : IRequestHandler<GetUserModelParameters, GetUserModelResults>
    {
        private readonly AppDBContext _dbContext;

        private const string FailedToFetchUserMessage = "Failed to fetch user";

        public GetUserModelHandler(AppDBContext dbContext, JwtHandler jwtHandler)
        {
            _dbContext = dbContext;
        }

        public async Task<GetUserModelResults> Handle(GetUserModelParameters request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.UserData
                .FirstOrDefaultAsync(u => u.Email == request.UserEmail);
            if (user == null)
            {
                throw new Exception(FailedToFetchUserMessage);
            }
            return new GetUserModelResults 
            { 
                User = user
            };
        }
    }
}
