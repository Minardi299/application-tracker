using application_tracker.Server.Models;
using application_tracker.Server.Models; // Your ApplicationUser model namespace
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.AspNetCore.Mvc;

namespace application_tracker.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
       public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
        {
            _configuration = configuration;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleAuthRequest payload)
        {
            if (string.IsNullOrEmpty(payload.Code))
            {
                return BadRequest(new { error = "Authorization code is missing." });
            }
            var clientId = _configuration["Authentication:Google:ClientId"];
            var clientSecret = _configuration["Authentication:Google:ClientSecret"];
            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        error = "Google authentication is not configured correctly on the server."
                    }
                );
            }
            var redirectUri = "postmessage";
            var flow = new GoogleAuthorizationCodeFlow(
                new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets
                    {
                        ClientId = clientId,
                        ClientSecret = clientSecret
                    },
                    Scopes = new[] { "openid", "email", "profile" }, // Specify the scopes you need
                    // DataStore = null, // Not storing flow state server-side for this simple exchange
                }
            );

            try
            {
                TokenResponse tokenResponse = await flow.ExchangeCodeForTokenAsync(
                    userId: "user",
                    code: payload.Code,
                    redirectUri: redirectUri,
                    taskCancellationToken: CancellationToken.None
                );

                // tokenResponse contains:
                // - AccessToken
                // - IdToken
                // - RefreshToken (if 'access_type=offline' was requested by client and it's the first exchange)
                // - ExpiresInSeconds
                // - TokenType

                // OPTIONAL: Validate ID Token and get user info
                try
                {
                    var validationSettings = new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new List<string> { clientId }
                    };
                    GoogleJsonWebSignature.Payload googleUserPayload =
                        await GoogleJsonWebSignature.ValidateAsync(
                            tokenResponse.IdToken,
                            validationSettings
                        );
                    Console.WriteLine(
                        $"Google User ID: {googleUserPayload}, Email: {googleUserPayload.Email}, Name: {googleUserPayload.Name}"
                    );
                    // Now you have user's Google profile info:
                    // googleUserPayload.Email, googleUserPayload.Name, googleUserPayload.Subject (Google User ID), etc.
                    // You can use this to find or create a user in your database (ApplicationUser)
                    // and then perhaps issue your own JWT or session cookie.
                }
                catch (InvalidJwtException ex)
                {
                    // Log error: ID token validation failed
                    return Unauthorized(
                        new { error = "Invalid Google ID token.", details = ex.Message }
                    );
                }

                // For simplicity, like the Express example, we return the tokens.
                // In a real app, you'd likely use the ID token to sign in the user
                // to your system (e.g., create a local account, issue your own JWT).
                return Ok(
                    new
                    {
                        //googlePayload = googleUserPayload, // Optional: include Google user info
                        accessToken = tokenResponse.AccessToken,
                        idToken = tokenResponse.IdToken,
                        refreshToken = tokenResponse.RefreshToken, // Handle refresh token carefully
                        expiresIn = tokenResponse.ExpiresInSeconds,
                        tokenType = tokenResponse.TokenType
                    }
                );
            }
            catch (TokenResponseException ex)
            {
                // Log ex.Error.ErrorDescription for more details
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        error = "Failed to exchange code for token.",
                        details = ex.Error?.ErrorDescription ?? ex.Message
                    }
                );
            }
            catch (Exception ex)
            {
                // Log ex
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        error = "An unexpected error occurred during Google sign-in.",
                        details = ex.Message
                    }
                );
            }
        }
    }
}
