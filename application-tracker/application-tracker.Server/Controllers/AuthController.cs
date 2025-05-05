using application_tracker.Server.Models; // Your ApplicationUser model namespace
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;

namespace application_tracker.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("google")]
        public async Task<IActionResult> GoogleVerify([FromBody] TokenRequest request)
        {
            try
            {
                Console.WriteLine($"Received token: {request.Token}");
                var payload = await GoogleJsonWebSignature.ValidateAsync(
                    request.Token,
                    new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new[]
                        {
                            Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? throw new InvalidOperationException("Google ClientId not configured.")

                        }
                    }
                );

                if (payload == null)
                    return Unauthorized("Invalid token");

                return Ok(
                    new
                    {
                        email = payload.Email,
                        name = payload.Name,
                        sub = payload.Subject,
                        picture = payload.Picture,
                    }
                );
            }
            catch (InvalidJwtException ex)
            {
                Console.WriteLine($"InvalidJwtException: {ex.Message}");
                return Unauthorized(new { error = "Invalid Google token", details = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return StatusCode(
                    500,
                    new { error = "Internal Server Error", details = ex.Message }
                );
            }
        }
    }
}
