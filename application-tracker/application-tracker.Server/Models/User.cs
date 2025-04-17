using System;
using System.Net.NetworkInformation;
using System.Security.Policy;
using Microsoft.AspNetCore.Identity;

namespace application_tracker.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();

        public ICollection<ApplicationFolder> Folders { get; set; } = new List<ApplicationFolder>();
    }
}
