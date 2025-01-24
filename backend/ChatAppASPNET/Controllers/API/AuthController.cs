using Domain.Handlers.APIHandlers;
using Domain.Models.APIModels;
using Domain.UseCases.APIUseCases;
using Infrastructure.DBContext;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace ChatApp.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {

        private readonly AppDBContext _dbContext;
        private readonly JwtHandler _jwtHandler;
        private readonly IConfiguration _config;
        private readonly IMediator _mediator;
        private const int hashingRounds = 16;
        private const int AccessTokenExpirationTime = 120;
        private const int RefreshTokenExpirationTime = 1440;

        private const string RegistrationFailureMessage = "Failed to create an account.";
        private const string RefreshTokenRequiredMessage = "Refresh token is required.";
        private const string RegistrationSuccessMessage = "Registration successful.";
        private const string PasswordMismatchMessage = "Passwords do not match!";
        private const string InvalidModelStateMessage = "Invalid model state.";
        private const string GenericErrorMessage = "Something went wrong...";
        private const string EmailTakenMessage = "Email is already taken.";


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
                    return BadRequest(PasswordMismatchMessage);
                }

                if (await _dbContext.UserData
                    .AnyAsync(u => u.Email == model.Email))
                {
                    return BadRequest(EmailTakenMessage);
                }

                await _mediator.Publish(new RegisterUserNotification
                {
                    model = model
                });
                return Ok(RegistrationSuccessMessage);
            }
            catch (Exception)
            {
                return BadRequest(RegistrationFailureMessage);
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

                var user = await _mediator.Send(new AuthenticateUserParameters
                {
                    model = model
                });

                var accessToken = await _mediator.Send(new ObtainTokenParameters
                {
                    User = user.User,
                    ExpirationTime = AccessTokenExpirationTime
                });

                var refreshToken = await _mediator.Send(new ObtainTokenParameters
                {
                    User = user.User,
                    ExpirationTime = RefreshTokenExpirationTime
                });

                return Ok(new
                {
                    AccessToken = accessToken.Token,
                    RefreshToken = refreshToken.Token
                });
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? GenericErrorMessage;
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
                    return BadRequest(InvalidModelStateMessage);
                }

                var token = await _mediator.Send(new RefreshTokenParameters
                {
                    model = model,
                    TokenExpirationTime = AccessTokenExpirationTime
                });
                return Ok(new
                {
                    AccessToken = token
                });
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message ?? GenericErrorMessage;
                return Unauthorized(errorMessage);
            }
        }
    }
}


