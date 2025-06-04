using application_tracker.Server.Models;
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
        [HttpGet("{ownerId}")]
        public async Task<ActionResult<IEnumerable<FolderDTO>>> GetFoldersFromUser(string ownerId)
        {
            var folders = await _context
                .ApplicationFolders.Where(f => f.OwnerId == ownerId)
                .OrderByDescending(f => f.CreatedAt)
                .Include(f => f.Owner)
                .ToListAsync();

            return Ok(folders.Select(FolderToDTO));
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
