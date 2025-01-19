using ChatAppASPNET;
using Domain.Models.APIModels;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.APIUseCases.Common
{
    public class AuthenticateUserParameters : IRequest<AuthenticateUserResults>
    {
        public required LoginModel model { get; set; }
    }

    public class AuthenticateUserResults
    {
        public required UserData User { get; set; }
    }

    public class AuthenticateUserHandler : IRequestHandler<AuthenticateUserParameters, AuthenticateUserResults>
    {
        private readonly AppDBContext _dbContext;
        private readonly JwtHandler _jwtHandler;

        public AuthenticateUserHandler(AppDBContext dbContext, JwtHandler jwtHandler)
        {
            _dbContext = dbContext;
            _jwtHandler = jwtHandler;
        }

        public async Task<AuthenticateUserResults> Handle(AuthenticateUserParameters request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == request.model.Email);
            if (user == null)
            {
                throw new Exception("Invalid credentials");
            };

            var password = await _dbContext.Passwords.FirstOrDefaultAsync(p => p.UserID == user.ID);
            if (password == null)
            {
                throw new Exception("Invalid credentials");
            }

            bool isValidPassword = PasswordHasher.VerifyPassword(request.model.Password, password.Salt, password.PasswordHash);

            if (!isValidPassword)
            {
                throw new Exception("Invalid credentials");
            }

            return new AuthenticateUserResults() { User = user };
        }
    }
}
