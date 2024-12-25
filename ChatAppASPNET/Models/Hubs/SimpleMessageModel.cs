using System.ComponentModel.DataAnnotations;

namespace ChatAppASPNET.Models.Hubs
{
    public class SimpleMessageModel
    {

        [Required]
        public int CID { get; set; }

        [Required]
        public string UserName { get; set; } = String.Empty;

        [Required]
        public string Content { get; set; } = String.Empty;
    }
}
