namespace Domain.Models.CommonModels
{
    public class UserDataModel
    {
        public required int ID { get; set; }

        public required string FirstName { get; set; } = string.Empty;

        public required string LastName { get; set; } = string.Empty;


        public required string Email { get; set; } = string.Empty;

    }
}
