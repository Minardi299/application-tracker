using System.Text.Json.Serialization;
namespace application_tracker.Server.Models
{
    public class GoogleAuthRequest
    {
        [JsonPropertyName("code")]
        public string? Code { get; set; }
    }
}