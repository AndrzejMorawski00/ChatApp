using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static ChatAppASPNET.DBContext.DBContext;

namespace ChatAppASPNET.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserDataController : ControllerBase
    {
        private readonly AppDBContext _dbContext;


        public UserDataController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Get()
        {
            var user = this.HttpContext.User;
            Console.WriteLine(user.Identity.Name);
            Console.WriteLine("Huh?");
            return Ok();
        }
    }
}
