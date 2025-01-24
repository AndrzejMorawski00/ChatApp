using Domain.UseCases.APIUseCases;
using Domain.UseCases.Common;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

        private const string InvalidUserEmailMessage = "Failed to get user data";
        private const string GenericErrorMessage = "Something went wrong...";

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
                if (userEmail == null)
                {
                    return BadRequest(InvalidUserEmailMessage);
                }

                var userData = await _mediator.Send(new GetUserModelParameters
                {
                    UserEmail = userEmail
                });
                var userResponse = await _mediator.Send(new GenerateFriendshipResponseParameters
                {
                    User = userData.User
                });
                return Ok(userResponse.FriendshipResponseModel);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? GenericErrorMessage;
                return BadRequest(ex.Message);
            }
        }
    }
}
