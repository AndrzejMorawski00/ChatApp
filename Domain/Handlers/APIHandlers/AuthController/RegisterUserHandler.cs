using Domain.Models.APIModels;
using Infrastructure.DBContext;
using Infrastructure.Entities;
using MediatR;


namespace Domain.Handlers.APIHandlers.AuthController.cs
{
    public class RegisterUserNotification : INotification
    {
        public required RegisterModel model { get; set; }
    }

    public class RegisterUserNotificationHandler : INotificationHandler<RegisterUserNotification>
    {
        private readonly IMediator _mediator;
        private readonly AppDBContext _dbContext;
        private readonly static int hashingRounds = 16;

        public RegisterUserNotificationHandler(IMediator mediator, AppDBContext dbContext)
        {
            _mediator = mediator;
            _dbContext = dbContext;
        }

        public async Task Handle(RegisterUserNotification notification, CancellationToken cancellationToken)
        {
            var salt = PasswordHasher.GenerateSalt();
            var model = notification.model;
            var hashedPassowrd = PasswordHasher.HashPassword(model.Password, salt, hashingRounds);
            var user = new UserData
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
            };

            var userId = await _dbContext.UserData.AddAsync(user);

            if (userId == null)
            {
                throw new Exception("Could not register User. Please try again.");
            }

            var password = new Password
            {
                UserID = user.ID,
                PasswordHash = hashedPassowrd,
                Salt = salt,
                PasswordSetDate = DateTime.UtcNow,
            };

            await _dbContext.Passwords.AddAsync(password);
            await _dbContext.SaveChangesAsync();
        }
    }
}
