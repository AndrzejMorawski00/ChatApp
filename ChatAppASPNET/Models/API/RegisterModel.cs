using System.ComponentModel.DataAnnotations;

namespace ChatAppASPNET.Models.API
{
    public class RegisterModel
    {
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        [Required]
        public string Email { get; set; } = String.Empty;
        [Required]
        public string Password { get; set; } = String.Empty;
        [Required]
        public string RepeatPassword { get; set; } = String.Empty;
    }
}
