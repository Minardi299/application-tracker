using System.Linq;
using application_tracker.Server.Helper;
using application_tracker.Server.Models;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly ApplicationDbContext _dbContext;

        public AuthController(
            JwtTokenGenerator jwtTokenGenerator,
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext dbContext
        )
        {
            _configuration = configuration;
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
            _dbContext = dbContext;
        }
        
        private async Task<(ApplicationUser? User, IActionResult? ErrorResult)> GetUserFromExternalLoginAsync(
            ApplicationUser user,
            string loginProvider,
            string providerKey,
            string providerDisplayName
        )
        {
            IList<UserLoginInfo> userLogins = await _userManager.GetLoginsAsync(user);
            UserLoginInfo? existingLogin = userLogins.FirstOrDefault(l =>
                l.LoginProvider == loginProvider && l.ProviderKey == providerKey
            );

            if (existingLogin == null)
            {
                IdentityResult addLoginResult = await _userManager.AddLoginAsync(
                    user,
                    new UserLoginInfo(loginProvider, providerKey, providerDisplayName)
                );
                if (!addLoginResult.Succeeded)
                {
                    // _logger?.LogError("Failed to add {LoginProvider} login to user {Email}. Errors: {Errors}", loginProvider, user.Email, string.Join(", ", addLoginResult.Errors.Select(e => e.Description)));
                    return (
                        null,
                        StatusCode(
                            StatusCodes.Status500InternalServerError,
                            new
                            {
                                error = $"Failed to link {loginProvider} account to existing user.",
                                details = addLoginResult.Errors.Select(e => e.Description)
                            }
                        )
                    );
                }
            }
            return (user, null);
        }
        private async Task<(ApplicationUser? User, IActionResult? ErrorResult)> CreateUserFromExternalLoginAsync(
            string email,
            string? givenName,
            string? familyName,
            bool emailVerified,
            string loginProvider,
            string providerKey,
            string providerDisplayName
        )
        {
            ApplicationUser user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FirstName = givenName,
                LastName = familyName,
                EmailConfirmed = emailVerified
            };
            IdentityResult createUserResult = await _userManager.CreateAsync(user);
            if (!createUserResult.Succeeded)
            {
                // _logger?.LogError("Failed to create new user from {LoginProvider} login. Errors: {Errors}", loginProvider, string.Join(", ", createUserResult.Errors.Select(e => e.Description)));
                return (
                    null,
                    StatusCode(
                        StatusCodes.Status500InternalServerError,
                        new { error = "Failed to create user.", details = createUserResult.Errors }
                    )
                );
            }
            IdentityResult addLoginResult = await _userManager.AddLoginAsync(
                user,
                new UserLoginInfo(loginProvider, providerKey, providerDisplayName)
            );
            if (!addLoginResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                // _logger?.LogWarning(
                //     "Failed to link external login for new user {Email}. User deleted. Errors: {Errors}",
                //     user.Email,
                //     string.Join(", ", addLoginResult.Errors.Select(e => e.Description))
                // );
                // _logger?.LogError("Failed to add {LoginProvider} login to new user {Email}. Errors: {Errors}", loginProvider, user.Email, string.Join(", ", addLoginResult.Errors.Select(e => e.Description)));
                return (
                    null,
                    StatusCode(
                        StatusCodes.Status500InternalServerError,
                        new
                        {
                            error = $"Failed to link {loginProvider} account to new user.",
                            details = addLoginResult.Errors.Select(e => e.Description)
                        }
                    )
                );
            }
            try
            {
                //await Helper.PopulateNewUserAsync(user, _dbContext);
                    await UserHelper.PopulateNewUserAsync(user, _dbContext);
                }
            catch (Exception ex)
            {
                // Log the error but don't fail user creation
                // _logger?.LogError(ex, "Failed to populate default data for user {Email}", user.Email);
            }
            return (user, null);
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
                ApplicationUser? existingUser  = await _userManager.FindByEmailAsync(
                    googleUserPayload.Email
                );
                (ApplicationUser? user, IActionResult? error) = existingUser == null
                    ? await CreateUserFromExternalLoginAsync(
                        googleUserPayload.Email,
                        googleUserPayload.GivenName,
                        googleUserPayload.FamilyName,
                        googleUserPayload.EmailVerified,
                        loginProvider,
                        providerKey,
                        providerDisplayName)
                    : await GetUserFromExternalLoginAsync(
                        existingUser,
                        loginProvider,
                        providerKey,
                        providerDisplayName);
                // user should only be null if error is not null, but check both to be safe
                if (error != null || user == null)
                    return error ?? StatusCode(500, new { error = "Unknown error." });
                
                
                // _logger?.LogInformation("Successfully linked Google account to existing user {Email}.", user.Email);

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
                }
                // if (!updateResult.Succeeded)
                // {
                //    _logger?.LogWarning("Could not update user {UserId} details from Google Sign In. Errors: {Errors}", user.Id, string.Join(", ", updateResult.Errors.Select(e=> e.Description)));
                // }
                // else
                // {
                //    _logger?.LogInformation("Updated user {UserId} details from Google Sign In.", user.Id);
                // }


                var accessToken = _jwtTokenGenerator.GenerateToken(user.Id, user.Email);
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
                        SameSite = SameSiteMode.Strict,
                        Path = "/",
                    }
                );
                RefreshToken refreshToken = await _jwtTokenGenerator.GenerateRefreshToken(_dbContext, user);
                await _userManager.UpdateAsync(user);

                HttpContext.Response.Cookies.Append(
                    "refreshToken",
                    refreshToken.Token,
                    new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Strict,
                        Path = "/",
                        Expires = refreshToken.ExpiresAt
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
        [HttpPost("refresh")]
        public async Task<ActionResult> RefreshToken()
        {
            if (!HttpContext.Request.Cookies.TryGetValue("refreshToken", out string? refreshToken) || string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("Missing refresh token cookie.");
            }
            RefreshToken? existingToken = await _dbContext.RefreshTokens
                .Include(rt => rt.Owner)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);
            if (existingToken == null || existingToken.ExpiresAt < DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }
            var newAccessToken = _jwtTokenGenerator.GenerateToken(existingToken.UserId, existingToken.Owner.Email);
            HttpContext.Response.Cookies.Append(
                "accessToken",
                newAccessToken,
                new CookieOptions
                {
                    Expires = DateTime.UtcNow.AddMinutes(
                        Convert.ToInt16(_configuration["Jwt:AccessTokenExpirationMinutes"])
                    ),
                    HttpOnly = true,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.Strict,
                    Path = "/",
                }
            );


            return NoContent();
        }
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            if (!HttpContext.Request.Cookies.TryGetValue("refreshToken", out string? refreshToken) || string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("Missing refresh token cookie.");
            }
            RefreshToken? existingToken = await _dbContext.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);
            //if (existingToken == null) return Unauthorized("Invalid or expired refresh token.");
            _dbContext.RefreshTokens.Remove(existingToken);
            await _dbContext.SaveChangesAsync();
            HttpContext.Response.Cookies.Delete(
                "accessToken",
                new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    Secure = true,
                    Path = "/"
                }
            );
            HttpContext.Response.Cookies.Delete(
                "refreshToken",
                new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    Secure = true,
                    Path = "/"
                }
            );

            return Ok(new { message = "Logout successful" });
        }
    }
}
