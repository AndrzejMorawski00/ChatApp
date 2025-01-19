using Domain.UseCases.APIUseCases.Common;
using Domain.UseCases.Common;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatAppASPNET.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

        public FriendsController(AppDBContext dbContext, IMediator mediator)
        {
            _dbContext = dbContext;
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userData = await _mediator.Send(new GetUserModelParameters() { UserEmail = userEmail });
                var userResponse = await _mediator.Send(new GenerateFriendshipResponseParameters() { User = userData.User });
                return Ok(userResponse.FriendshipResponseModel);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? "Something went wrong...";
                return BadRequest(ex.Message);
            }
        }
    }
}
