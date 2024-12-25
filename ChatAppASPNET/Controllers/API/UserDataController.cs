using ChatAppASPNET.DBContext;
using ChatAppASPNET.DBContext.Entities;
using ChatAppASPNET.Models.API;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ChatAppASPNET.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserDataController : ControllerBase
    {
        private readonly AppDBContext _dbContext;


        public UserDataController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll(string? searchParameter)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value!;
                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null)
                {
                    return BadRequest("Failed to fetch users");
                }

                var relatedUsers = await _dbContext.Friends.Where(f => f.SenderID
                 == user.ID || f.ReceiverID == user.ID).Select(f => f.SenderID == user.ID ? f.ReceiverID : f.SenderID).ToListAsync();


                var query = _dbContext.UserData
                    .Where(u => u.ID != user.ID && !relatedUsers.Contains(u.ID));

                if (!string.IsNullOrEmpty(searchParameter))
                {
                    query = query.Where(u =>
                        u.FirstName.Contains(searchParameter) ||
                        u.LastName.Contains(searchParameter) ||
                        u.Email.Contains(searchParameter));
                }

                var userProfiles = await query
                    .Select(p => new UserDataModel
                    {
                        Email = p.Email,
                        FirstName = p.FirstName,
                        LastName = p.LastName,
                        ID = p.ID
                    })
                    .ToListAsync();

                return Ok(userProfiles);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("GetSingle")]
        public async Task<IActionResult> GetSingle()
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value!;
                var userProfile = await _dbContext.UserData.FirstAsync(u => u.Email == userEmail);

                var userProfileModel = new UserDataModel
                {
                    Email = userProfile.Email,
                    ID = userProfile.ID,
                    FirstName = userProfile.FirstName,
                    LastName = userProfile.LastName,
                };


                return Ok(userProfileModel);

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}

