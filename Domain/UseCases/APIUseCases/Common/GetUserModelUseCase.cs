using ChatAppASPNET;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.APIUseCases.Common
{
    public class GetUserModelParameters : IRequest<GetUserModelResults>
    {
        public required string UserEmail { get; set; }
    }

    public class GetUserModelResults
    {
        public required UserData User {  get; set; }
    }

    public class GetUserModelHandler : IRequestHandler<GetUserModelParameters, GetUserModelResults>
    {
        private readonly AppDBContext _dbContext;

        public GetUserModelHandler(AppDBContext dbContext, JwtHandler jwtHandler)
        {
            _dbContext = dbContext;
        }

        public async Task<GetUserModelResults> Handle(GetUserModelParameters request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == request.UserEmail);
            if (user == null)
            {
                throw new Exception("Failed to fetch user");
            }
            return new GetUserModelResults() { User = user, };
        }
    }
}
