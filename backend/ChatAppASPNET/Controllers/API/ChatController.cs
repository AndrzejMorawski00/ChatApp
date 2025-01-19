using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Infrastructure.DBContext;
using Domain.UseCases.Common;
using MediatR;
using Domain.UseCases.APIUseCases.Common;

namespace ChatAppASPNET.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatController : ControllerBase
    {

        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

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
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value!;
                var user = await _mediator.Send(new GetUserModelParameters() { UserEmail = userEmail });
                var userChats = await _mediator.Send(new UserChatListResponseParameters() { User = user.User });
                return Ok(userChats.ChatList);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? "Something went wrong...";
                return BadRequest(ex.Message);
            }
        }
    }
}


