using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using application_tracker.Server.Models; // Your ApplicationUser model namespace
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization; // Need this for [AllowAnonymous]
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace application_tracker.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [AllowAnonymous] // Allow access to login endpoints without prior authentication
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger; // Add logging

        public AuthController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            ILogger<AuthController> logger
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
        }

        // GET: api/auth/google-login
        // This endpoint initiates the Google Authentication flow
        [HttpGet("google-login")]
        public IActionResult GoogleLogin(string? returnUrl = null)
        {
            // Define the redirect URI after Google authenticates the user.
            // This MUST match the callbackPath configured in AddGoogle (or the default /signin-google)
            // However, we will redirect AGAIN from our Callback endpoint AFTER issuing the JWT.
            //var callbackPath = Url.Action(nameof(GoogleCallback)); // URL for our *custom* callback action below
            //var callbackPath = Url.Action(nameof(GoogleCallback), "auth", null, Request.Scheme);
            //var properties = _signInManager.ConfigureExternalAuthenticationProperties(GoogleDefaults.AuthenticationScheme, callbackPath);
            //new version
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleCallback", "Auth", null, Request.Scheme)
            };
            _logger.LogInformation(
                "Initiating Google login. Properties configured for callback: {CallbackUrl}",
                properties.RedirectUri
            );

            // Challenge the Google scheme, this will trigger the redirect to Google
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        // GET: api/auth/google-callback
        // This endpoint is hit AFTER Google authenticates the user and redirects back to the app.
        // It handles the external login info, finds/creates the user, and generates the JWT.
        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            _logger.LogInformation("Received callback from Google.");

            var authenticateResult = await HttpContext.AuthenticateAsync(
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            if (!authenticateResult.Succeeded)
                return Unauthorized();

            var email = authenticateResult.Principal.FindFirstValue(ClaimTypes.Email);
            var user = await _userManager.FindByEmailAsync(email);

            // Register the user if they don't exist
            if (user == null)
            {
                var userName =
                    authenticateResult.Principal.FindFirstValue(ClaimTypes.Name)
                    ?? email.Split('@')[0];
                user = new ApplicationUser { UserName = userName, Email = email, };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
            }

            await _signInManager.SignInAsync(user, isPersistent: true);

            // Redirect to the frontend after successful authentication
            return Redirect("/");
        }

        [Authorize]
        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Logged out successfully" });
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var jwtKey =
                _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT Key not configured.");
            var jwtIssuer =
                _configuration["Jwt:Issuer"]
                ?? throw new InvalidOperationException("JWT Issuer not configured.");
            var jwtAudience =
                _configuration["Jwt:Audience"]
                ?? throw new InvalidOperationException("JWT Audience not configured.");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Add necessary claims (you can add more)
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id), // Subject = User ID
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique token identifier
                new Claim(ClaimTypes.NameIdentifier, user.Id), // Standard claim for Name Identifier
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty) // Standard claim for Name
                // Add roles if you use them:
                // var roles = await _userManager.GetRolesAsync(user);
                // foreach (var role in roles) { claims.Add(new Claim(ClaimTypes.Role, role)); }
            };

            // TODO: Add roles to claims if you use ASP.NET Core Identity Roles
            // var roles = await _userManager.GetRolesAsync(user);
            // claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));


            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(120), // Set token expiration time
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
