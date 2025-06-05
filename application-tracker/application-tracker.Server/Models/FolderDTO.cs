namespace application_tracker.Server.Models
{ 
    public class FolderDTO
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public int ApplicationCount { get; set; }
    }

}