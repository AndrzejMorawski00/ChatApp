using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class SimpleMessage
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public int CID { get; set; }

        public DateTime CreatedTime { get; set; }

        [Required]
        public string UserName { get; set; } = String.Empty;

        [Required]
        public string Content { get; set; } = String.Empty;
    }
}
