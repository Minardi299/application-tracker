using System;
using System.Security.Policy;

namespace application_tracker.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();

        public ICollection<ApplicationFolder> Folders { get; set; } = new List<ApplicationFolder>();
    }
}
