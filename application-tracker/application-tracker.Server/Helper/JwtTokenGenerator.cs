using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using application_tracker.Server.Models;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.IdentityModel.Tokens;

namespace application_tracker.Server.Helper
{
    public class JwtTokenGenerator
    {
        private readonly IConfiguration _configuration;

        public JwtTokenGenerator(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<RefreshToken> GenerateRefreshToken(ApplicationDbContext _dbContext,ApplicationUser user) 
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            RefreshToken refreshToken = new RefreshToken
            {
                UserId = user.Id,
                Owner = user,
                Token = Convert.ToBase64String(randomBytes),
                ExpiresAt = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:RefreshTokenExpirationDays"])),
                CreatedAt = DateTime.UtcNow
            };
            await _dbContext.RefreshTokens.AddAsync(refreshToken);
            await _dbContext.SaveChangesAsync();
            return refreshToken; 
        }

        // public string GenerateToken(ApplicationUser user)
        // {
        //     var tokenHandler = new JwtSecurityTokenHandler();
        //     var claims = new List<Claim>
        //     {
        //         new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        //         new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        //         new Claim(JwtRegisteredClaimNames.Email, user.Email),
        //     };
        //     var tokenDescriptor = new SecurityTokenDescriptor
        //     {
        //         Subject = new ClaimsIdentity(claims),
        //         Expires = DateTime.UtcNow.AddMinutes(
        //             Convert.ToInt16(_configuration["Jwt:AccessTokenExpirationMinutes"])
        //         ),
        //         Issuer = _configuration["Jwt:Issuer"],
        //         Audience = _configuration["Jwt:Audience"],
        //         SigningCredentials = new SigningCredentials(
        //             new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
        //             SecurityAlgorithms.HmacSha256Signature
        //         )
        //     };

        //     SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

        //     return tokenHandler.WriteToken(token);
        // }

        public string GenerateToken(string userId, string email)
        {
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Sub, userId),
                    new Claim(JwtRegisteredClaimNames.Email, email),
                };
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddMinutes(
                        Convert.ToInt16(_configuration["Jwt:AccessTokenExpirationMinutes"])
                    ),
                    Issuer = _configuration["Jwt:Issuer"],
                    Audience = _configuration["Jwt:Audience"],
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                        SecurityAlgorithms.HmacSha256Signature
                    )
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);

                return tokenHandler.WriteToken(token);
            }
        }
    }
}
