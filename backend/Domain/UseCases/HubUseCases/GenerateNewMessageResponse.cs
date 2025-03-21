﻿using Domain.Models.CommonModels;
using Entities;
using Infrastructure.DBContext;
using MediatR;



namespace Domain.UseCases.HubUseCases
{
    public class GenerateNewMessageParameters : IRequest<GenerateNewMessageResults>
    {
        public required Message Message { get; set; }
        public required bool IsOwner { get; set; }

    }

    public class GenerateNewMessageResults
    {
        public required ResponseMessageModel ResponseMessage { get; set; }
    }

    public class GenerateNewMessageHandler : IRequestHandler<GenerateNewMessageParameters, GenerateNewMessageResults>
    {
        private readonly AppDBContext _dbContext;

        public GenerateNewMessageHandler(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GenerateNewMessageResults> Handle(GenerateNewMessageParameters request, CancellationToken cancellationToken)
        {
            var newMessage = request.Message;
            var response = new ResponseMessageModel
            {
                ID = newMessage.ID,
                ChatID = newMessage.ChatID,
                SendTime = newMessage.SentTime,
                SenderData = new SenderDataModel
                {
                    IsOwner = request.IsOwner,
                    ID = newMessage.SenderID,
                    FirstName = newMessage.Sender.FirstName,
                    LastName = newMessage.Sender.LastName
                },
                Content = newMessage.Content,
            };
            return new GenerateNewMessageResults
            {
                ResponseMessage = response
            };
        }
    }
}
