using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using application_tracker.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace application_tracker.Server.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApplicationUserDTO>>> GetUsers()
        {
            var users = await _userManager.Users.Select(u => UserToDTO(u)).ToListAsync();

            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationUserDTO>> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

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
            return StatusCode(201);
        }

        // PUT: api/Users/5 (Update username or email)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, ApplicationUserDTO dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            user.UserName = dto.UserName;
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
                UserName = user.UserName,
                Email = user.Email,
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
