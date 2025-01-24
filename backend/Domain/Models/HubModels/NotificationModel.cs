namespace Domain.Models.HubModels
{
    public class NotificationModel
    {
        public required string? MessageType { get; set; }
        public required string? MessageContent { get; set; }
        public required object? MessagePayload { get; set; }
    }
}
