using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace application_tracker.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        //consider adding fluent validation for properties
        public new string Email
        {
            get => base.Email!;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Email cannot be null or empty.");
                base.Email = value;
            }
        }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
        public int TotalApplicationCount { get; set; } = 3;
        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();

        public ICollection<ApplicationFolder> Folders { get; set; } = new List<ApplicationFolder>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    }
}
