﻿using ChatAppASPNET.DBContext.Entities;
using ChatAppASPNET.DBContext;
using ChatAppASPNET.Models.Hubs;
using ChatAppASPNET;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ChatAppASPNET.Models.API;

using static ChatAppASPNET.Utils;

namespace ChatAppASPNET.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatController : ControllerBase
    {

        private readonly AppDBContext _dbContext;

        public ChatController(AppDBContext appDBContext)
        {
            _dbContext = appDBContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value!;

            var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return BadRequest("Failed to fetch user");
            }

            var userChats = await UserChatList(_dbContext, user);

            return Ok(userChats);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PostChatModel model)
        {

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data");
                }


                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

                var user = await _dbContext.UserData.FirstOrDefaultAsync(u => u.Email == userEmail);

                if (user == null)
                {
                    return BadRequest("Failed to fetch user data");
                }



                var newChat = new Chat
                {
                    ChatType = ChatType.Group,
                    ChatName = model.ChatName,
                    Owner = user.ID
                };

                _dbContext.Chats.Add(newChat);

                model.ParticipantsID.Add(user.ID);

                var userIDSet = new HashSet<int>(model.ParticipantsID);

                var participants = await _dbContext.UserData.Where(u => userIDSet.Contains(u.ID)).Select(u => new ChatParticipant
                {
                    ChatID = newChat.ID,
                    UserID = u.ID,
                }).ToListAsync();

                _dbContext.ChatParticipants.AddRange(participants);

                newChat.Participants = participants;

                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return BadRequest(ex.Message);
            }
        }
    }
}


