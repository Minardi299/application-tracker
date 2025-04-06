namespace application_tracker.Server.Models
{
    public class JobApplicationDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string Position { get; set; }
        public string JobPostingUrl { get; set; }
        public string Notes { get; set; }
        public ApplicationStatus Status { get; set; }
        public DateTime AppliedDate { get; set; }
        public List<ApplicationFolder> Folders { get; set; }
    }
}