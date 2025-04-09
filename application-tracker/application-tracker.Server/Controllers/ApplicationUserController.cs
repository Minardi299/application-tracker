using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using application_tracker.Server.Models;

namespace application_tracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ApplicationUserController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/Users
        [HttpGet]
        public ActionResult<IEnumerable<ApplicationUserDTO>> GetUsers()
        {
            var users = _userManager.Users
                .Select(u => UserToDTO(u))
                .ToList();

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
    }
}
