using ChatAppASPNET.DBContext;
using ChatAppASPNET.DBContext.Entities;
using ChatAppASPNET.Models.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatAppASPNET.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : Controller
    {
        private readonly AppDBContext _dbContext;


        public MessagesController(AppDBContext appDBContext)
        {
            _dbContext = appDBContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int pageNumber = 1, int pageSize = 10)
        {

            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest("Page number and page size must be greater than 0.");
            }
            var totalCount = await _dbContext.SimpleMessages.CountAsync();
            var messages = await _dbContext.SimpleMessages.OrderBy(x => x.CreatedTime).Reverse().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            var paginatedList = new PaginatedResponse<SimpleMessage>(messages, totalCount, pageNumber, pageSize);
            return Ok(paginatedList);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SimpleMessageModel message)
        {
            try
            {
                var dbMessage = new SimpleMessage
                {
                    CID = message.CID,
                    UserName = message.UserName,
                    Content = message.Content,
                    CreatedTime = DateTime.UtcNow,
                };

                await _dbContext.AddAsync(dbMessage);
                await _dbContext.SaveChangesAsync();
                return Ok(dbMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error occurred at {0}: {1}", DateTime.UtcNow, ex.ToString());
                Console.WriteLine("Stack Trace: " + ex.StackTrace);
                if (ex.InnerException != null)
                {
                    Console.WriteLine("Inner Exception: " + ex.InnerException.ToString());
                }

                return BadRequest(ex.Message);
            }
        }
    }
}
