using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Infrastructure.DBContext;
using Domain.UseCases.Common;
using MediatR;
using Domain.UseCases.APIUseCases;

namespace ChatApp.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatController : ControllerBase
    {

        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

        private const string GenericErrorMessage = "Something went wrong...";
        private const string InvalidUserEmailMessage = "Failed to get user data";

        public ChatController(AppDBContext appDBContext, IMediator mediator)
        {
            _dbContext = appDBContext;
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
                var user = await _mediator.Send(new GetUserModelParameters
                {
                    UserEmail = userEmail
                });
                var userChats = await _mediator.Send(new UserChatListResponseParameters
                {
                    User = user.User
                });
                return Ok(userChats.ChatList);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? GenericErrorMessage;
                return BadRequest(ex.Message);
            }
        }
    }
}


