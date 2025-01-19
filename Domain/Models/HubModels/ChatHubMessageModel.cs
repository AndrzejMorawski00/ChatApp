namespace Domain.Models.HubModels
{
    public class MessageData
    {
        public string? Content { get; set; }
        public string? Type { get; set; }
    }
    public class ChatHubMessageModel<T>
    {
        public MessageData? Message { get; set; }
        public T? Payload { get; set; }
    }
}

