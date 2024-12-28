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
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
                    throw new Exception("Page number and page size must be greater than 0.");
                }

                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value!;

                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

                if (user == null)
                {
                    throw new Exception("Failed to fetch user data");
                }

                var chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ID == chatID);

                if (chat == null)
                {
                    throw new Exception("Failed to fetch chat data");
                };

                var totalCount = _dbContext.Messages.Where(m => m.ChatID == chat.ID).Count();

                var messages = await _dbContext.Messages.Where(m => m.ChatID == chat.ID).OrderBy(x => x.SentTime).Reverse().Skip((pageNumber - 1) * pageSize).Take(pageSize).Select(m => new ResponseMessageModel
                {
                    ID = m.ID,
                    ChatID = m.ChatID,
                    SendTime = m.SentTime,
                    SenderData = new SenderDataModel
                    {
                        ID = m.SenderID,
                        FirstName = m.Sender.FirstName,
                        LastName = m.Sender.LastName
                    }
                }).ToListAsync();

                var paginatedList = new PaginatedResponse<ResponseMessageModel>(messages, totalCount, pageNumber, pageSize);
                return Ok(paginatedList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
                return BadRequest(ex.Message);
            }


        }
    }
}
