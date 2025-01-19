using Domain.UseCases.APIUseCases.Common;
using Domain.UseCases.APIUseCases.Messages;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatAppASPNET.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly static int pageSize = 10;
        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

        public MessagesController(AppDBContext dbContext, IMediator mediator)
        {
            _dbContext = dbContext;
            _mediator = mediator;
        }


        [HttpGet]
        public async Task<IActionResult> Get(int chatID, int pageNumber)
        {
            try
            {
                if (pageNumber <= 0)
                {
                    return BadRequest("Page number must be greater than 0.");
                }

                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

                var user = await _mediator.Send(new GetUserModelParameters() { UserEmail = userEmail });
                
                var messageResponse = await _mediator.Send(new GetMessageListParameters() { 
                    ChatID = chatID,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    User = user.User,
                });

                return Ok(messageResponse.Response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, "An error occurred while processing your request.");
            }


        }
    }
}
