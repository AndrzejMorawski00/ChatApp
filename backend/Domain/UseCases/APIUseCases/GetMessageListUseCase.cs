using Domain.Models.CommonModels;
using Infrastructure.DBContext;
using Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Models.APIModels;

namespace Domain.UseCases.APIUseCases
{
    public class GetMessageListParameters : IRequest<GetMessageListResults>
    {
        public required UserData User { get; set; }
        public required int ChatID { get; set; }
        public required int PageSize { get; set; }
        public required int PageNumber { get; set; }
    }

    public class GetMessageListResults
    {
        public required PaginatedResponse<ResponseMessageModel> Response { get; set; }
    }

    public class GetMessageListHandler : IRequestHandler<GetMessageListParameters, GetMessageListResults>
    {
        private readonly AppDBContext _dbContext;

        private const string ChatNotFoundErrorMessage = "Chat data not found.";

        public GetMessageListHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GetMessageListResults> Handle(GetMessageListParameters request, CancellationToken cancellationToken)
        {
            var chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ID == request.ChatID);
            if (chat == null)
            {
                throw new Exception(ChatNotFoundErrorMessage);
            }

            var totalCount = await _dbContext.Messages
                .Where(m => m.ChatID == chat.ID)
                .CountAsync();

            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            if (request.PageNumber > totalPages)
            {
                var response = new PaginatedResponse<ResponseMessageModel>(new List<ResponseMessageModel>(), totalCount, request.PageNumber, request.PageSize);
                return new GetMessageListResults() { Response = response };
            }

            var messages = await _dbContext.Messages
                .Where(m => m.ChatID == chat.ID)
                .OrderBy(x => x.SentTime)
                .Reverse()
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(m => new ResponseMessageModel
                {
                    ID = m.ID,
                    ChatID = m.ChatID,
                    SendTime = m.SentTime,
                    SenderData = new SenderDataModel
                    {
                        IsOwner = m.SenderID == request.User.ID,
                        ID = m.SenderID,
                        FirstName = m.Sender.FirstName,
                        LastName = m.Sender.LastName
                    },
                    Content = m.Content,
                })
                .ToListAsync();

            var paginatedList = new PaginatedResponse<ResponseMessageModel>(messages, totalCount, request.PageNumber, request.PageSize);
            return new GetMessageListResults() { Response = paginatedList };
        }
    }
}
