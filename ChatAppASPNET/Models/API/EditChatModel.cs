namespace ChatAppASPNET.Models.API
{
    public class EditChatModel
    {   
        public int chatID { get; set; }
        public string ChatName { get; set; } = string.Empty;

        public ICollection<int> ParticipantsID { get; set; } = new List<int>();

    }
}
