using ChatAppASPNET.DBContext;
using ChatAppASPNET.DBContext.Entities;
using ChatAppASPNET.Models.API;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChatAppASPNET.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class MessagesController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly int pageSize = 10;

        public MessagesController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
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

                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null)
                {
                    return NotFound("User data not found.");
                }

                var chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ID == chatID);
                if (chat == null)
                {
                    return NotFound("Chat data not found.");
                }

                var totalCount = await _dbContext.Messages
                    .Where(m => m.ChatID == chat.ID)
                    .CountAsync();

                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                if (pageNumber > totalPages)
                {
                    return Ok(new PaginatedResponse<ResponseMessageModel>(new List<ResponseMessageModel>(), totalCount, pageNumber, pageSize));
                }

                var messages = await _dbContext.Messages
                    .Where(m => m.ChatID == chat.ID)
                    .OrderBy(x => x.SentTime)
                    .Reverse()
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(m => new ResponseMessageModel
                    {
                        ID = m.ID,
                        ChatID = m.ChatID,
                        SendTime = m.SentTime,
                        SenderData = new SenderDataModel
                        {
                            IsOwner = m.SenderID == user.ID,
                            ID = m.SenderID,
                            FirstName = m.Sender.FirstName,
                            LastName = m.Sender.LastName
                        },
                        Content = m.Content,
                    })
                    .ToListAsync();

                var paginatedList = new PaginatedResponse<ResponseMessageModel>(messages, totalCount, pageNumber, pageSize);
                return Ok(paginatedList);
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
