using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace application_tracker.Server.Models
{
    public class ApplicationFolder
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(50)]
        public required string Name { get; set; }
        

        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
        public required string OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public required ApplicationUser Owner { get; set; }

        [NotMapped]
        public int ApplicationCount => Applications?.Count ?? 0;

        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    }
}