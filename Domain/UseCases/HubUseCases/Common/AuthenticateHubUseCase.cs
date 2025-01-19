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

namespace Domain.UseCases.HubUseCases.Common
{
    public class AuthenticateHubParameters : IRequest<AuthenticateHubResults>
    {
        public HubCallerContext Context { get; set; }
    }

    public class AuthenticateHubResults
    {
        public UserData User { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;

    }

    public class AuthenticateHubHandler : IRequestHandler<AuthenticateHubParameters, AuthenticateHubResults>
    {
        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

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
                throw new ArgumentNullException("User Email is Empty");
            }
            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                throw new Exception("Faile to fetch user data");

            }

            return new AuthenticateHubResults
            {
                User = user,
            };
        }
    }
}

