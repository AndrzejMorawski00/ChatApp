using Domain.Models.APIModels;
using Entities;
using Infrastructure.DBContext;
using MediatR;


namespace Domain.Handlers.APIHandlers
{
    public class RegisterUserNotification : INotification
    {
        public required RegisterModel model { get; set; }
    }

    public class RegisterUserNotificationHandler : INotificationHandler<RegisterUserNotification>
    {
        private readonly IMediator _mediator;
        private readonly AppDBContext _dbContext;
        private const int HashingRounds = 16;

        private const string FailedToRegisterUserMessage = "Could not register User. Please try again.";

        public RegisterUserNotificationHandler(IMediator mediator, AppDBContext dbContext)
        {
            _mediator = mediator;
            _dbContext = dbContext;
        }

        public async Task Handle(RegisterUserNotification notification, CancellationToken cancellationToken)
        {
            var salt = PasswordHasher.GenerateSalt();
            var model = notification.model;
            var hashedPassowrd = PasswordHasher.HashPassword(model.Password, salt, HashingRounds);
            var user = new UserData
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
            };

            var userId = await _dbContext.UserData.AddAsync(user);

            if (userId == null)
            {
                throw new Exception(FailedToRegisterUserMessage);
            }

            var password = new Password
            {
                UserID = user.ID,
                User = user,
                PasswordHash = hashedPassowrd,
                Salt = salt,
                PasswordSetDate = DateTime.UtcNow,
            };

            await _dbContext.Passwords.AddAsync(password);
            await _dbContext.SaveChangesAsync();
        }
    }
}
