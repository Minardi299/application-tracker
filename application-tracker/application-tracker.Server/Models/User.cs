using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace application_tracker.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();

        public ICollection<ApplicationFolder> Folders { get; set; } = new List<ApplicationFolder>();
    }
}
