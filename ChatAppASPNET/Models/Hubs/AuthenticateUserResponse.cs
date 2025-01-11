using ChatAppASPNET.DBContext.Entities;

namespace ChatAppASPNET.Models.Hubs
{
    public class AuthenticateUserResponse
    {
        public UserData User { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
