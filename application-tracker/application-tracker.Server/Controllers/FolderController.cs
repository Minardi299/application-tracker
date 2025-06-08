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
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new FolderDTO {
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
                .Include(f => f.Applications) 
                .FirstOrDefaultAsync();
            if (folder == null)
                return NotFound("Folder not found.");

            // Map manually or use AutoMapper
            var folderDto = new FolderDTO
            {
                Id = folder.Id,
                Name = folder.Name,
                CreatedAt = folder.CreatedAt,
                ApplicationCount = folder.Applications.Count,
Applications = folder.Applications.Select(app => new JobApplicationDTO
                 {
                     Id = app.Id,
                     CompanyName = app.CompanyName,
                     Position = app.Position,
                     Status = app.Status,
                     Notes = app.Notes,
                     JobPostingUrl = app.JobPostingUrl,
                    CreatedAt = app.CreatedAt,
                 }).ToList()
            };

            return Ok(folderDto);
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
