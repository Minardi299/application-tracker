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

            var folders = await _context.ApplicationFolders
                .Where(f => f.OwnerId == ownerId)
                .OrderBy(f => f.CreatedAt)
                .Select(f => new FolderDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                    CreatedAt = f.CreatedAt,
                    ApplicationCount = f.Applications.Count
                })
                .ToArrayAsync();

            return Ok(folders);
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<FolderDTO>> GetFolderById(Guid id)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized();

            var folder = await _context.ApplicationFolders
            .Where(f => f.Id == id && f.OwnerId == ownerId)
            .Select(f => new FolderDTO
            {
                Id = f.Id,
                Name = f.Name,
                CreatedAt = f.CreatedAt,
                ApplicationCount = f.Applications.Count
            })
            .FirstOrDefaultAsync();

            return Ok(folder);
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<FolderDTO>> PutFolder(Guid id, FolderDTO folderDTO)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (ownerId == null)
                return Unauthorized();
            if (id != folderDTO.Id)
            {
                return BadRequest();
            }
            var folder = await _context.ApplicationFolders
                .FirstOrDefaultAsync(f => f.Id == id && f.OwnerId == ownerId);
            if (folder == null) return NotFound();
            folder.Name = folderDTO.Name;

            await _context.SaveChangesAsync();
            return Ok(FolderToDTO(folder));
            
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

            return CreatedAtAction(
                nameof(GetFolderById),
                new { id = folder.Id},
                FolderToDTO(folder));
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFolder(Guid id)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (ownerId == null)
                return Unauthorized();
            ApplicationUser? user = await _context.Users.FindAsync(ownerId);
            if (user == null)
            {
                return NotFound("User not found");
            }


            ApplicationFolder? folder = await _context.ApplicationFolders
                .Include(f => f.Applications)
                .FirstOrDefaultAsync(f => f.Id == id && f.OwnerId == ownerId);
            if (folder == null) return NotFound();

            folder.Applications.Clear(); 
            await _context.SaveChangesAsync();

            _context.ApplicationFolders.Remove(folder);
            await _context.SaveChangesAsync();

            return NoContent();
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
