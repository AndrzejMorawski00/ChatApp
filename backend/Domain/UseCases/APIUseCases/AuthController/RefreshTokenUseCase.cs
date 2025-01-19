using ChatAppASPNET;
using Domain.Models.APIModels;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;



namespace Domain.UseCases.APIUseCases.AuthController
{
    public class RefreshTokenParameters : IRequest<RefreshTokenResults>
    {

        public required RefreshTokenModel model { get; set; }
        public required int TokenExpirationTime { get; set; }
    }

    public class RefreshTokenResults
    {
        public required string Token { get; set; }
    }

    public class RefreshTokenHandler : IRequestHandler<RefreshTokenParameters, RefreshTokenResults>
    {
        private readonly AppDBContext _dbContext;
        private readonly JwtHandler _jwtHandler;

        public RefreshTokenHandler(AppDBContext dbContext, JwtHandler jwtHandler)
        {
            _dbContext = dbContext;
            _jwtHandler = jwtHandler;
        }

        public async Task<RefreshTokenResults> Handle(RefreshTokenParameters request, CancellationToken cancellationToken)
        {


            var principal = _jwtHandler.ValidateToken(request.model.RefreshToken);
            if (principal == null)
            {
                throw new Exception("Invalid refresh token.");
            }

            var userEmail = principal.FindFirstValue(ClaimTypes.Email);

            if (userEmail == null)
            {
                throw new Exception("Invalid refresh token.");
            }

            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            var newAccessToken = _jwtHandler.GenerateJwtToken(user, expiresInMinutes: request.TokenExpirationTime);

            return new RefreshTokenResults() { Token = newAccessToken };
        }
    }
}
