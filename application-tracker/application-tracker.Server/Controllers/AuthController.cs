using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using application_tracker.Server.Helper;
using application_tracker.Server.Helper;
using application_tracker.Server.Models;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace application_tracker.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public AuthController(
            JwtTokenGenerator jwtTokenGenerator,
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager
        )
        {
            _configuration = configuration;
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
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
                GoogleJsonWebSignature.Payload googleUserPayload;

                try
                {
                    var validationSettings = new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new List<string> { clientId }
                    };
                    googleUserPayload = await GoogleJsonWebSignature.ValidateAsync(
                        tokenResponse.IdToken,
                        validationSettings
                    );
                }
                catch (InvalidJwtException ex)
                {
                    // Log error: ID token validation failed
                    return Unauthorized(
                        new { error = "Invalid Google ID token.", details = ex.Message }
                    );
                }
                string loginProvider = "Google";
                string providerKey = googleUserPayload.Subject;
                string providerDisplayName = "Google";
                ApplicationUser? user = await _userManager.FindByEmailAsync(
                    googleUserPayload.Email
                );
                if (user == null)
                {
                    // Create a new user if they don't exist
                    user = new ApplicationUser
                    {
                        UserName = googleUserPayload.Email,
                        Email = googleUserPayload.Email,
                        FirstName = googleUserPayload.GivenName,
                        LastName = googleUserPayload.FamilyName,
                        EmailConfirmed = googleUserPayload.EmailVerified,

                        // You can set other properties like FirstName, LastName, etc. if needed
                    };
                    IdentityResult createUserResult = await _userManager.CreateAsync(user);
                    if (!createUserResult.Succeeded)
                    {
                        return StatusCode(
                            StatusCodes.Status500InternalServerError,
                            new
                            {
                                error = "Failed to create user.",
                                details = createUserResult.Errors
                            }
                        );
                    }
                    IdentityResult addLoginResult = await _userManager.AddLoginAsync(
                        user,
                        new UserLoginInfo(loginProvider, providerKey, providerDisplayName)
                    );
                    if (!addLoginResult.Succeeded)
                    {
                        // _logger?.LogError("Failed to add Google login to new user {Email}. Errors: {Errors}", user.Email, string.Join(", ", addLoginResult.Errors.Select(e => e.Description)));
                        return StatusCode(
                            StatusCodes.Status500InternalServerError,
                            new
                            {
                                error = "Failed to link Google account to new user.",
                                details = addLoginResult.Errors.Select(e => e.Description)
                            }
                        );
                    }
                }
                else
                {
                    IList<UserLoginInfo> userLogins = await _userManager.GetLoginsAsync(user);
                    UserLoginInfo? googleLogin = userLogins.FirstOrDefault(l =>
                        l.LoginProvider == loginProvider && l.ProviderKey == providerKey
                    );

                    if (googleLogin == null)
                    {
                        IdentityResult addLoginResult = await _userManager.AddLoginAsync(
                            user,
                            new UserLoginInfo(loginProvider, providerKey, providerDisplayName)
                        );
                        if (!addLoginResult.Succeeded)
                        {
                            // _logger?.LogError("Failed to add Google login to existing user {Email}. Errors: {Errors}", user.Email, string.Join(", ", addLoginResult.Errors.Select(e => e.Description)));
                            return StatusCode(
                                StatusCodes.Status500InternalServerError,
                                new
                                {
                                    error = "Failed to link Google account to existing user.",
                                    details = addLoginResult.Errors.Select(e => e.Description)
                                }
                            );
                        }
                        // _logger?.LogInformation("Successfully linked Google account to existing user {Email}.", user.Email);
                    }

                    bool updated = false;
                    if (user.FirstName != googleUserPayload.GivenName)
                    {
                        user.FirstName = googleUserPayload.GivenName;
                        updated = true;
                    }
                    if (user.LastName != googleUserPayload.FamilyName)
                    {
                        user.LastName = googleUserPayload.FamilyName;
                        updated = true;
                    }
                    if (!user.EmailConfirmed && googleUserPayload.EmailVerified)
                    {
                        user.EmailConfirmed = googleUserPayload.EmailVerified;
                        updated = true;
                    }

                    if (updated)
                    {
                        IdentityResult updateResult = await _userManager.UpdateAsync(user);
                        // if (!updateResult.Succeeded)
                        // {
                        //    _logger?.LogWarning("Could not update user {UserId} details from Google Sign In. Errors: {Errors}", user.Id, string.Join(", ", updateResult.Errors.Select(e=> e.Description)));
                        // }
                        // else
                        // {
                        //    _logger?.LogInformation("Updated user {UserId} details from Google Sign In.", user.Id);
                        // }
                    }
                }
                var accessToken = _jwtTokenGenerator.GenerateToken(user.Id, user?.Email);
                HttpContext.Response.Cookies.Append(
                    "accessToken",
                    accessToken,
                    new CookieOptions
                    {
                        Expires = DateTime.UtcNow.AddMinutes(
                            Convert.ToInt16(_configuration["Jwt:AccessTokenExpirationMinutes"])
                        ),
                        HttpOnly = true,
                        Secure = true,
                        IsEssential = true,
                        SameSite = SameSiteMode.Lax,
                        // SameSite = SameSiteMode.Strict,
                        // Path = "/",
                    }
                );
                ApplicationUserDTO UserDTO = new ApplicationUserDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ProfilePictureUrl = googleUserPayload.Picture,
                    CreatedAt = user.CreatedAt
                };

                // For simplicity, like the Express example, we return the tokens.
                // In a real app, you'd likely use the ID token to sign in the user
                // to your system (e.g., create a local account, issue your own JWT).
                return Ok(new { user = UserDTO });
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
        
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Response.Cookies.Delete(
                "accessToken",
                new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Lax,
                    Secure = true,
                    // Path = "/"
                }
            );

            return Ok(new { message = "Logout successful" });
        }
    }
}
