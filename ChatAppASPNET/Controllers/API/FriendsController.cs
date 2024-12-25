using ChatAppASPNET.DBContext;
using ChatAppASPNET.DBContext.Entities;
using ChatAppASPNET.Models.API;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChatAppASPNET.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly AppDBContext _dbContext;

        public FriendsController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return BadRequest("User email not found");
            }

            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return BadRequest("User doesn't extist");
            }

            var userFriends = await _dbContext.Friends
                .Where(f => f.SenderID == user.ID || f.ReceiverID == user.ID)
                .ToListAsync();

            var accepted = new List<FriendModel>();
            var sentByUser = new List<FriendModel>();
            var receivedFromFriend = new List<FriendModel>();

            foreach (var f in userFriends)
            {
                var friendModel = new FriendModel
                {
                    ID = f.ID,
                    SenderID = f.SenderID,
                    FriendData = _dbContext.UserData
                        .Where(u => u.ID == (f.SenderID == user.ID ? f.ReceiverID : f.SenderID))
                        .Select(u => new UserDataModel
                        {
                            Email = u.Email,
                            FirstName = u.FirstName,
                            LastName = u.LastName,
                            ID = u.ID
                        })
                        .FirstOrDefault()!,
                    Status = f.Status
                };

                if (f.Status == FriendshipStatus.Accepted)
                {
                    accepted.Add(friendModel);
                }
                else if (f.SenderID == user.ID)
                {
                    sentByUser.Add(friendModel);
                }
                else if (f.ReceiverID == user.ID) 
                {
                    receivedFromFriend.Add(friendModel);
                }
            }

            var groupedResponse = new
            {
                Accepted = accepted,
                Sent= sentByUser,
                Received = receivedFromFriend
            };

            return Ok(groupedResponse);
        }

    }
}
