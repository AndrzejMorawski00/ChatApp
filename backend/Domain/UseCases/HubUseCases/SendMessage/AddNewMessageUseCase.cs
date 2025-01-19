using Domain.Models.HubModels;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.UseCases.HubUseCases.SendMessage
{
    public class AddNewMessageParameters : IRequest<AddNewMessageResults>
    {
        public required NewMessageModel model { get; set; }
        public required UserData User { get; set; }
    }

    public class AddNewMessageResults
    {
        public required Message Message { get; set; }
        public required string GroupName { get; set; }
    }

    public class AddNewMessageHandler : IRequestHandler<AddNewMessageParameters, AddNewMessageResults>
    {
        private readonly AppDBContext _dbContext;

        public AddNewMessageHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<AddNewMessageResults> Handle(AddNewMessageParameters request, CancellationToken cancellationToken)
        {
            var chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ID == request.model.ChatID);

            if (chat is null)
            {
                throw new Exception("Failed to fetch data");
            }

            var newMessage = new Message
            {
                ChatID = chat.ID,
                SenderID = request.User.ID,
                SentTime = DateTime.Now,
                Content = request.model.Content,
            };
            var groupName = $"{chat.ChatName}_{chat.ID}";
            await _dbContext.AddAsync(newMessage);
            await _dbContext.SaveChangesAsync();

            return new AddNewMessageResults()
            {
                Message = newMessage,
                GroupName = groupName
            };

        }
    }
}
