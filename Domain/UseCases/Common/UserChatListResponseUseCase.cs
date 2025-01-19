using Domain.Models;
using Domain.Models.CommonModels;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.Utils;

namespace Domain.UseCases.Common
{

    public class UserChatListResponseParameters : IRequest<UserChatListResponseResults>
    {
        public required UserData User { get; set; }
    }

    public class UserChatListResponseResults
    {
        public required List<ChatModel> ChatList { get; set; }
    }

    public class UserChatListResponseHandler : IRequestHandler<UserChatListResponseParameters, UserChatListResponseResults>
    {
        private readonly AppDBContext _dbContext;

        public UserChatListResponseHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<UserChatListResponseResults> Handle(UserChatListResponseParameters request, CancellationToken cancellationToken)
        {
            var userChats = await _dbContext.Chats
             .Include(c => c.Participants).ThenInclude(cp => cp.User)
             .Where(c => c.Participants.Any(p => p.UserID == request.User.ID))
             .Select(c => new ChatModel
             {
                 ID = c.ID,
                 ChatType = (int)c.ChatType,
                 ChatName = GetChatName(request.User, c),
                 Owner = c.Owner,
                 IsOwner = c.Owner == request.User.ID,
                 ChatParticipants = c.Participants.Select(p => new ChatParticipantModel
                 {
                     ID = p.UserID,
                     FirstName = p.User.FirstName,
                     LastName = p.User.LastName
                 })
                     .ToList()
             })
             .ToListAsync();

            return new UserChatListResponseResults() { ChatList = userChats };
        }


    }
}
