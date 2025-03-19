
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using ChatApp.Hubs;
using Infrastructure.DBContext;
using Domain;
using Domain.Handlers.HubHandlers;
using DotNetEnv;

namespace ChatApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var config = builder.Configuration;
            Env.TraversePath().Load();
            builder.Configuration.AddEnvironmentVariables();

            //Database
           var dbHost = Environment.GetEnvironmentVariable("DATABASE_HOST") ?? throw new Exception("DATABASE_HOST is missing");
            var dbPort = Environment.GetEnvironmentVariable("DATABASE_PORT") ?? throw new Exception("DATABASE_PORT is missing");
            var dbName = Environment.GetEnvironmentVariable("DATABASE_NAME") ?? throw new Exception("DATABASE_NAME is missing");
            var dbUser = Environment.GetEnvironmentVariable("DATABASE_USERNAME") ?? throw new Exception("DATABASE_USERNAME is missing");
            var dbPassword = Environment.GetEnvironmentVariable("DATABASE_PASSWORD") ?? throw new Exception("DATABASE_PASSWORD is missing");
            var migrateStr = Environment.GetEnvironmentVariable("MIGRATE") ?? throw new Exception("MIGRATE is missing");
            if (!bool.TryParse(migrateStr, out var migrate))
            {
                throw new Exception("MIGRATE is not a valid boolean");
            }
            var dbConnection = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";

            // Allowed Hosts
            var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? throw new Exception("FRONTEND_URL is missing");

            // JWT Secret Key
            var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new Exception("JWT_SECRET is missing");

            // Add services to the container.
            builder.Services.AddSignalR();
            builder.Services.AddControllers();
            builder.Services.AddControllersWithViews();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<AppDBContext>(options => options.UseNpgsql(dbConnection));
            builder.Services.AddScoped<AppDBContext>();
            builder.Services.AddSingleton<JwtHandler>();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSignalR();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins(frontendUrl)
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            builder.Services.AddMediatR(cfg =>
            {
                //Domain Assembly
                cfg.RegisterServicesFromAssembly(typeof(ErrorNotificationHandler).Assembly);
                cfg.RegisterServicesFromAssembly(typeof(NotifyGroupExceptUserHandler).Assembly);
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(cfg =>
                {
                    var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey!));
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
                                path.StartsWithSegments("/chatHub"))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;

                        }
                    };
                });

            var app = builder.Build();

            // Don't use in production
            // if (app.Environment.IsDevelopment())
            // {
                app.UseSwagger();
                app.UseSwaggerUI();
            // }

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDBContext>();
                if (migrate)
                {
                    Console.WriteLine("Applying migrations...");
                    dbContext.Database.Migrate();
                }
                else
                {
                    Console.WriteLine("Migrations are skipped.");
                }
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
