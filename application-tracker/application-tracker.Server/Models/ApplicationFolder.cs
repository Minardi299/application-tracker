using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace application_tracker.Server.Models
{
    public class ApplicationFolder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public required string Name { get; set; }

        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public int OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public required User Owner { get; set; }

        [NotMapped]
        public int ApplicationCount => Applications?.Count ?? 0;

        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    }
}