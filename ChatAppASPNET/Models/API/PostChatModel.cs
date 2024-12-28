namespace ChatAppASPNET.Models.API
{
    public class PostChatModel
    {
        public string ChatName { get; set; } = string.Empty;

        public ICollection<int> ParticipantsID { get; set; } = new List<int>();
    }
}
