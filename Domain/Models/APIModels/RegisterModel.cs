using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.APIModels
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
