namespace Domain.Models.HubModels
{
    public class NewChatModel
    {
        public string ChatName { get; set; } = string.Empty;

        public List<int> ParticipantsID { get; set; } = new List<int>();
    }
}
