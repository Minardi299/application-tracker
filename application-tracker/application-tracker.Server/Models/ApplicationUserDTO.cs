namespace application_tracker.Server.Models
{
    public class ApplicationUserDTO
    {
        public string Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
