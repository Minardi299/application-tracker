using System.Security.Claims;
using application_tracker.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace application_tracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FolderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FolderController(ApplicationDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FolderDTO>>> GetFoldersFromUser()
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized();

            var folders = await _context
                .ApplicationFolders.Where(f => f.OwnerId == ownerId)
                .OrderByDescending(f => f.CreatedAt)
                .Include(f => f.Owner)
                .ToArrayAsync();

            return Ok(folders.Select(FolderToDTO));
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<FolderDTO>> CreateFolder(FolderDTO folderDto)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized();
            ApplicationUser? owner = await _context.Users.FindAsync(ownerId);
            if (owner == null)
                return NotFound("Owner not found.");
            var folder = new ApplicationFolder
            {
                Name = folderDto.Name,
                Owner = owner,
                OwnerId = ownerId
            };

            _context.ApplicationFolders.Add(folder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFoldersFromUser), FolderToDTO(folder));
        }

        private static FolderDTO FolderToDTO(ApplicationFolder folder) =>
            new FolderDTO
            {
                Id = folder.Id,
                Name = folder.Name,
                CreatedAt = folder.CreatedAt,
                ApplicationCount = folder.ApplicationCount
            };
    }
}
