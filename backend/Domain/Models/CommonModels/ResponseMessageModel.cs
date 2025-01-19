namespace Domain.Models.CommonModels
{
    public class ResponseMessageModel
    {
        public int ID { get; set; }
        public int ChatID { get; set; }

        public DateTime SendTime { get; set; }

        public required SenderDataModel SenderData { get; set; }

        public string Content { get; set; } = string.Empty;
    }
}
