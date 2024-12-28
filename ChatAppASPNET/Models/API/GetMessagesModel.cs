namespace ChatAppASPNET.Models.API
{
    public class GetMessagesModel
    {
        public int ChatID { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 10;
    }
}
