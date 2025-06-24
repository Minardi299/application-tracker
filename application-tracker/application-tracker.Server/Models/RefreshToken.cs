using System.ComponentModel.DataAnnotations.Schema;

namespace application_tracker.Server.Models;
public class RefreshToken
{
    public int Id { get; set; }
    public required string Token { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public required string OwnerId { get; set; }


    [ForeignKey("OwnerId")]
    public required ApplicationUser Owner { get; set; }
}