using Domain.UseCases.APIUseCases;
using Domain.UseCases.Common;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace ChatApp.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserDataController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;

        private const string GenericErrorMessage = "Something went wrong...";
        private const string UserEmailErrorMessage = "Couldn't get user email";


        public UserDataController(AppDBContext dbContext, IMediator mediator)
        {
            _dbContext = dbContext;
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll(string? searchParameter)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

                if (userEmail == null)
                {
                    return BadRequest(UserEmailErrorMessage);
                }
                var user = await _mediator.Send(new GetUserModelParameters
                {
                    UserEmail = userEmail
                });

                var userProfiles = await _mediator.Send(new GetUserListResponseParameters
                {
                    User = user.User,
                    SearchParameter = searchParameter
                });

                return Ok(userProfiles.Users);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? GenericErrorMessage;
                return BadRequest(ex.Message);
            }
        }
    }
}

