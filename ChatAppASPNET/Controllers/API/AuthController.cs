using ChatAppASPNET.DBContext.Entities;
using ChatAppASPNET.Models.API;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static ChatAppASPNET.DBContext.DBContext;

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

        public AuthController(AppDBContext dbContext, IConfiguration config, JwtHandler jwtHandler)
        {
            _jwtHandler = jwtHandler;
            _dbContext = dbContext;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
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

            var salt = PasswordHasher.GenerateSalt();
            var hashedPassowrd = PasswordHasher.HashPassword(model.Password, salt, hashingRounds);
            var user = new UserData
            {
                Email = model.Email,
            };

            var userId = await _dbContext.UserData.AddAsync(user);

            var userProfile = new UserProfile
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserData = user,
            };

            if (userId == null)
            {
                return BadRequest("Could not register User. Please try again.");
            }

            var password = new Password
            {
                PasswordHash = hashedPassowrd,
                Salt = salt,
                HashingRounds = hashingRounds,
                Id = user.Id,
                PasswordSetDate = DateTime.UtcNow,
            };

            await _dbContext.Passwords.AddAsync(password);
            await _dbContext.Profiles.AddAsync(userProfile);    
            await _dbContext.SaveChangesAsync();
            return Ok("Registration successful.");
        }


        [HttpPost("token")]
        public async Task<IActionResult> ObtainToken([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null) return Unauthorized("Invalid credentials");

            var password = await _dbContext.Passwords.FirstOrDefaultAsync(p => p.Id == user.Id);
            if (password == null) return Unauthorized("Invalid credentials");

            bool isValidPassword = PasswordHasher.VerifyPassword(model.Password, password.Salt, password.PasswordHash);

            if (!isValidPassword)
            {
                return Unauthorized("Invalid credentials");
            }

            var accessToken = _jwtHandler.GenerateJwtToken(user, expiresInMinutes: 1);
            var refreshToken = _jwtHandler.GenerateJwtToken(user, expiresInMinutes: 5);

            return Ok(new { AccessToken = accessToken, RefreshToken = refreshToken });

        }


        [HttpPost("token/refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenModel model)
        {
            if (string.IsNullOrEmpty(model.RefreshToken))
            {
                return BadRequest("Refresh token is required.");
            }

            var principal = _jwtHandler.ValidateToken(model.RefreshToken);
            if (principal == null)
            {
                return Unauthorized("Invalid refresh token.");
            }

            var email = principal.FindFirstValue(ClaimTypes.Name);
            if (email == null)
            {
                return Unauthorized("Invalid refresh token.");
            }

            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            var newAccessToken = _jwtHandler.GenerateJwtToken(user, expiresInMinutes: 1);


            return Ok(new { AccessToken = newAccessToken });
        }


    }
}