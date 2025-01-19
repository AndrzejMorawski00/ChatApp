using Domain.Handlers.APIHandlers.AuthController.cs;
using Domain.Models.APIModels;
using Domain.UseCases.APIUseCases.AuthController;
using Domain.UseCases.APIUseCases.Common;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace ChatAppASPNET.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {

        private readonly IConfiguration _config;
        private readonly AppDBContext _dbContext;
        private readonly JwtHandler _jwtHandler;
        private static int hashingRounds = 16;
        private static int AccessTokenExpirationTime = 120;
        private static int RefreshTokenExpirationTime = 1440;
        private readonly IMediator _mediator;

        public AuthController(AppDBContext dbContext, IConfiguration config, JwtHandler jwtHandler, IMediator mediator)
        {
            _jwtHandler = jwtHandler;
            _dbContext = dbContext;
            _config = config;
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (model.Password != model.RepeatPassword)
                {
                    return BadRequest("Password do not match!");
                }

                if (await _dbContext.UserData.AnyAsync(u => u.Email == model.Email))
                {
                    return BadRequest("Email is taken");
                }

                await _mediator.Publish(new RegisterUserNotification() { model = model });
                return Ok("Registration successful.");
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to create an account");
            }
        }


        [HttpPost("token")]
        public async Task<IActionResult> ObtainToken([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _mediator.Send(new AuthenticateUserParameters() { model = model });

                var accessToken = await _mediator.Send(new ObtainTokenParameters() { User = user.User, ExpirationTime = AccessTokenExpirationTime });

                var refreshToken = await _mediator.Send(new ObtainTokenParameters() { User = user.User, ExpirationTime = RefreshTokenExpirationTime });

                return Ok(new { AccessToken = accessToken.Token, RefreshToken = refreshToken.Token });
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? "Something went wrong...";
                return BadRequest(errorMessage);
            }
        }

        [HttpPost("token/refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.RefreshToken))
                {
                    return BadRequest("Refresh token is required.");
                }

                var token = await _mediator.Send(new RefreshTokenParameters() { model = model, TokenExpirationTime = AccessTokenExpirationTime });
                return Ok(new { AccessToken = token });
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? "Something went wrong...";
                return Unauthorized(errorMessage);
            }
        }
    }
}