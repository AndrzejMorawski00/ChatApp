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

            var friendModels = userFriends.Select(f => new FriendModel
            {
                ID = f.ID,
                SenderID = f.SenderID,
                ReceiverID = f.ReceiverID,
                SenderData = _dbContext.UserData
                    .Where(u => u.ID == f.SenderID)
                    .Select(u => new UserDataModel
                    {
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        ID = u.ID
                    })
                    .FirstOrDefault()!,
                ReceiverData = _dbContext.UserData
                    .Where(u => u.ID == f.ReceiverID)
                    .Select(u => new UserDataModel
                    {
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        ID = u.ID
                    })
                    .FirstOrDefault()!,
                IsSender = f.SenderID == user.ID,
                Status = f.Status
            }).ToList();

            var groupedResponse = new Dictionary<string, List<FriendModel>>()
    {
        { "accepted", new List<FriendModel>() },
        { "sent", new List<FriendModel>() },
        { "received", new List<FriendModel>() }
    };

            foreach (var friend in friendModels)
            {
                if (friend.Status == FriendshipStatus.Accepted)
                {
                    groupedResponse["accepted"].Add(friend);
                }
                else if (friend.Status != FriendshipStatus.Accepted && friend.IsSender)
                {
                    groupedResponse["sent"].Add(friend);
                }
                else if (friend.Status != FriendshipStatus.Accepted && !friend.IsSender)
                {
                    groupedResponse["received"].Add(friend);
                }
            }

            return Ok(groupedResponse);
        }

    }
}
