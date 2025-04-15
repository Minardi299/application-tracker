namespace application_tracker.Server.Models
{
    public class RegistrationResponseDTO
    {
        public bool Success { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}