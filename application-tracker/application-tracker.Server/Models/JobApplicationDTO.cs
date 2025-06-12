namespace application_tracker.Server.Models
{
    public class JobApplicationDTO
    {
        public Guid Id { get; set; }
        public required string CompanyName { get; set; }
        public required string Position { get; set; }
        public required string JobPostingUrl { get; set; }
        public required string Notes { get; set; }
        public ApplicationStatus Status { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public List<FolderDTO> Folders { get; set; } = new();
    }
}