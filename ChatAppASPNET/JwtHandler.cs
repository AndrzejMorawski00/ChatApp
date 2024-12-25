using ChatAppASPNET.DBContext.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChatAppASPNET
{
    public class JwtHandler
    {
        private readonly IConfiguration _config;

        public JwtHandler(IConfiguration configuration)
        {
            _config = configuration;
        }


        public string GenerateJwtToken(UserData user, int expiresInMinutes)
        {
            var securityKey = _config["Jwt:secretKey"]!;
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature);

            var claims = new[] {
                new Claim(ClaimTypes.Email, user.Email.ToString()),
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(expiresInMinutes),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            var securityKey = _config["Jwt:secretKey"]!;
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = signingKey,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
