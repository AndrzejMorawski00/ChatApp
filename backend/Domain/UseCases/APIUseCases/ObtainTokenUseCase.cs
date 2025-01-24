using Infrastructure.DBContext;
using Entities;
using MediatR;

namespace Domain.UseCases.APIUseCases
{
    public class ObtainTokenParameters : IRequest<ObtainTokenResults>
    {
        public required UserData User { get; set; }
        public required int ExpirationTime { get; set; }
    }

    public class ObtainTokenResults
    {
        public required string Token { get; set; }
    }

    public class ObtainTokenHandler : IRequestHandler<ObtainTokenParameters, ObtainTokenResults>
    {
        private readonly AppDBContext _dbContext;
        private readonly JwtHandler _jwtHandler;

        public ObtainTokenHandler(AppDBContext dbContext, JwtHandler jwtHandler)
        {
            _dbContext = dbContext;
            _jwtHandler = jwtHandler;
        }

        public async Task<ObtainTokenResults> Handle(ObtainTokenParameters request, CancellationToken cancellationToken)
        {
            var token = _jwtHandler.GenerateJwtToken(request.User, expiresInMinutes: request.ExpirationTime);

            return new ObtainTokenResults() { Token = token };
        }
    }
}
