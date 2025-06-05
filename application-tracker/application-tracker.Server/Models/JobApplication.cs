using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace application_tracker.Server.Models
{
    public class JobApplication
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [StringLength(100)]
        public string? CompanyName { get; set; }

        [StringLength(100)]
        public string? Position { get; set; }

        [Url]
        public string? JobPostingUrl { get; set; }

        public string? Notes { get; set; }

        public required ApplicationStatus Status { get; set; }

        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? UpdatedDate { get; set; }

        public required string OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public required ApplicationUser Owner { get; set; }
        public ICollection<ApplicationFolder> Folders { get; set; } = new List<ApplicationFolder>();
    }

    public enum ApplicationStatus
    {
        Wishlist,
        Applied,
        Interviewing,
        OfferReceived,
        Rejected,
        Accepted,
        Withdrawn
    }
}