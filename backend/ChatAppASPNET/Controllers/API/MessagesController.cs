using Domain.UseCases.APIUseCases;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {

        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

        private const int PageSize = 10;
        private const string PageNumberErrorMessage = "Page number must be greater than 0.";
        private const string UserEmailErrorMessage = "Couldn't get user email";
        private const string GenericErrorMessage = "An error occurred while processing your request.";

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
                    return BadRequest(PageNumberErrorMessage);
                }

                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

                if (userEmail == null)
                {
                    return BadRequest(UserEmailErrorMessage);
                }


                var user = await _mediator.Send(new GetUserModelParameters
                {
                    UserEmail = userEmail
                });

                var messageResponse = await _mediator.Send(new GetMessageListParameters
                {
                    ChatID = chatID,
                    PageNumber = pageNumber,
                    PageSize = PageSize,
                    User = user.User,
                });

                return Ok(messageResponse.Response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, GenericErrorMessage);
            }


        }
    }
}
