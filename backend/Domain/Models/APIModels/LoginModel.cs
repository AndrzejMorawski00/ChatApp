using System.ComponentModel.DataAnnotations;


namespace Domain.Models.APIModels
{
    public class LoginModel
    {
        [Required]
        public string Email { get; set; } = String.Empty;
        [Required]
        public string Password { get; set; } = String.Empty;
    }
}
