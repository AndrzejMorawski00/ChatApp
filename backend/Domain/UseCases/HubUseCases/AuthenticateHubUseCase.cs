using MediatR;
using Entities;
using System.Security.Claims;
using Infrastructure.DBContext;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;


namespace Domain.UseCases.HubUseCases
{
    public class AuthenticateHubParameters : IRequest<AuthenticateHubResults>
    {
        public required HubCallerContext Context { get; set; }
    }

    public class AuthenticateHubResults
    {
        public required UserData User { get; set; }
    }

    public class AuthenticateHubHandler : IRequestHandler<AuthenticateHubParameters, AuthenticateHubResults>
    {
        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

        private const string UserEmailEmptyError = "User Email is Empty";
        private const string UserFetchError = "Failed to fetch user data";

        public AuthenticateHubHandler(AppDBContext dbContext, IMediator mediator)
        {
            _dbContext = dbContext;
            _mediator = mediator;
        }

        public async Task<AuthenticateHubResults> Handle(AuthenticateHubParameters request, CancellationToken cancellationToken)
        {
            var userEmail = request.Context.User?.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                throw new ArgumentNullException(UserEmailEmptyError);
            }
            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                throw new Exception(UserFetchError);
            }

            return new AuthenticateHubResults
            {
                User = user,
            };
        }
    }
}

