using Domain.UseCases.APIUseCases.Common;
using Domain.UseCases.Common;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace ChatAppASPNET.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserDataController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly IMediator _mediator;


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
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value!;
                var user = await _mediator.Send(new GetUserModelParameters() { UserEmail = userEmail });

                var userProfiles = await _mediator.Send(new GetUserListResponseParameters() { User=user.User, SearchParameter = searchParameter});

                return Ok(userProfiles.Users);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? "Something went wrong...";
                return BadRequest(ex.Message);
            }
        }
    }
}

