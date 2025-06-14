using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace application_tracker.Server.Models
{
    public class FolderDTO
    {
        public Guid Id { get; set; }

        [StringLength(50)]
        public required string Name { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public int ApplicationCount { get; set; }

        public List<JobApplicationDTO> Applications { get; set; } = new();

    }

}