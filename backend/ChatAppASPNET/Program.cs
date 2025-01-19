
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using ChatAppASPNET.Hubs;
using Infrastructure.DBContext;
using Domain.UseCases.HubUseCases.Common;
using Domain.UseCases.HubUseCases.AddFriend;
using Domain.Handlers.HubHandlers.Common;
using Domain.UseCases.Common;
using Domain.Handlers.APIHandlers.AuthController.cs;
using Domain.Handlers.HubHandlers;
using Domain.Handlers.HubHandlers.DeleteChat;
using Domain.Handlers.HubHandlers.JoinGroup;
using Domain.Handlers.HubHandlers.SendMessage;
using Domain.UseCases.APIUseCases.AuthController;
using Domain.UseCases.APIUseCases.Common;
using Domain.UseCases.APIUseCases.Messages;
using Domain.UseCases.HubUseCases.AcceptFriend;
using Domain.UseCases.HubUseCases.CreateNewChat;
using Domain.UseCases.HubUseCases.DeleteChat;
using Domain.UseCases.HubUseCases.EditChat;
using Domain.UseCases.HubUseCases.LeaveChat;
using Domain.UseCases.HubUseCases.RemoveFriend;
using Domain.UseCases.HubUseCases.SendMessage;




namespace ChatAppASPNET
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var config = builder.Configuration;
            builder.Configuration.AddJsonFile("appsettings.json");

            // Add services to the container.
            builder.Services.AddSignalR();
            builder.Services.AddControllers();
            builder.Services.AddControllersWithViews();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<AppDBContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddScoped<AppDBContext>();
            builder.Services.AddSingleton<JwtHandler>();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSignalR();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            builder.Services.AddMediatR(cfg =>
            {
                //Handlers
                cfg.RegisterServicesFromAssembly(typeof(RegisterUserNotificationHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(EditChatNotificationHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(ErrorNotificationHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(NotifyUsersNotificationHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(UserNotificationHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(CreateNewChatNotificationHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(DeleteChatNotificationHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(JoinGroupNotificationHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(NotifyGroupExceptUserNotificationHandler).Assembly);
                // UseCases
                cfg.RegisterServicesFromAssembly(typeof(AuthenticateUserHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(ObtainTokenHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(RefreshTokenHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(GetUserModelHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(GetMessageListHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(DivideFriendshipsResponseHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(GenerateFriendshipResponseHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(GetUserListResponseHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(UserChatListResponseHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(AcceptFriendshipHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(ValidateFriendshipUseCaseHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(CreateFriendshipUseCaseHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(AuthenticateHubHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(GenerateUserChatListResponseHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(CreateNewChatHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(DeleteChatHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(EditChatDBActionHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(GetEditChatHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(LeaveChatHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(RemoveFriendshipHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(AddNewMessageHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(GenerateNewMessageHandler).Assembly);
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(cfg =>
                {
                    var securityKey = config["Jwt:secretKey"];

                    var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
                    var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature);

                    cfg.RequireHttpsMetadata = false;
                    cfg.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        IssuerSigningKey = signingKey,
                        NameClaimType = "name"
                    };

                    cfg.Events = new JwtBearerEvents()
                    {
                        OnAuthenticationFailed = async context =>
                        {
                            var ex = context.Exception;
                            Console.WriteLine(ex.Message);
                        }
                    };

                    cfg.Events = new JwtBearerEvents()
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/chatHub")))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;

                        }
                    };
                });


            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseDeveloperExceptionPage();
            app.UseCors("AllowFrontend");
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapHub<ChatHub>("/chatHub");
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();

        }

    }
}
