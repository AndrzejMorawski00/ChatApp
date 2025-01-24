namespace Domain.Models.CommonModels
{
    public class SenderDataModel
    {
        public int ID { get; set; }
        public bool IsOwner { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}
