using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using application_tracker.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace application_tracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UserController(UserManager<ApplicationUser> userManager,ApplicationDbContext context )
        {
            _userManager = userManager;
            _context = context;
        }



        // GET: api/Users/5
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<ApplicationUserDTO>> GetUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            ApplicationUser? user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound();

            return Ok(UserToDTO(user));
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDTO userRegistration)
        {
            if (userRegistration is null)
            {
                return BadRequest();
            }
            var user = RegistrationUserDTO(userRegistration);
            var result = await _userManager.CreateAsync(user, userRegistration.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new RegistrationResponseDTO { Success = false, Errors = errors });
            }
            return Ok(UserToDTO(user));
        }

        // PUT: api/Users/5 (Update  email)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, ApplicationUserDTO dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            user.Email = dto.Email;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }

        private static ApplicationUserDTO UserToDTO(ApplicationUser user) =>
            new ApplicationUserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                TotalApplicationCount = user.TotalApplicationCount,
                CreatedAt = user.CreatedAt
            };

        private static ApplicationUser RegistrationUserDTO(UserRegistrationDTO userRegistration)
        {
            ApplicationUser user = new ApplicationUser
            {
                UserName = userRegistration.UserName,
                Email = userRegistration.Email
            };
            return user;
        }
    }
}
