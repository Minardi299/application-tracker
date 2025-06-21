﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using application_tracker.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace application_tracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/JobApplications
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobApplicationDTO>>> GetJobApplications()
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized();
            JobApplication[] jobApplications = await _context
                .JobApplications
                .Where(x => x.OwnerId == ownerId)
                .OrderByDescending(x => x.CreatedAt)
                .ToArrayAsync();
            

            return Ok(jobApplications.Select(JobApplicationToDTO));
        }
        [Authorize]
        [HttpGet("folder/{folderId}")]
        public async Task<ActionResult<IEnumerable<JobApplicationDTO>>> GetJobApplicationsByFolder(Guid folderId)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized();
            JobApplication[] jobApplications = await _context
                .JobApplications
                .Where(x => x.OwnerId == ownerId && x.Folders.Any(f => f.Id == folderId))
                .Include(x => x.Folders)
                .OrderByDescending(x => x.CreatedAt)
                .ToArrayAsync();

            return Ok(jobApplications.Select(JobApplicationToDTO));
        }
        // GET: api/JobApplications/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<JobApplicationDTO>> GetJobApplication(Guid id)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            JobApplication jobApplication = await _context.JobApplications.FindAsync(id);
            if (jobApplication == null)
            {
                return NotFound();
            }
            if (ownerId != jobApplication.OwnerId)
                return Unauthorized();
            return JobApplicationToDTO(jobApplication);
        }
        // PUT: api/JobApplications/{id}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJobApplication(Guid id, JobApplicationDTO jobApplicationDTO)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (ownerId == null)
                return Unauthorized();
            if (id != jobApplicationDTO.Id)
            {
                return BadRequest();
            }
            var jobApplication = await _context.JobApplications
            .Include(j => j.Folders)
            .FirstOrDefaultAsync(j => j.Id == id && j.OwnerId == ownerId);
                if (jobApplication == null) return NotFound();


            jobApplication.CompanyName = jobApplicationDTO.CompanyName;
            jobApplication.Position = jobApplicationDTO.Position;
            jobApplication.JobPostingUrl = jobApplicationDTO.JobPostingUrl;
            jobApplication.Notes = jobApplicationDTO.Notes;
            jobApplication.Status = jobApplicationDTO.Status;
                var folderIds = jobApplicationDTO.Folders.Select(f => f.Id).ToList();

            List<ApplicationFolder> folders = await _context.ApplicationFolders
                .Where(f => folderIds.Contains(f.Id) && f.OwnerId == ownerId)
                .ToListAsync();
            jobApplication.Folders = folders;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!JobApplicationExists(id))
            {
                return NotFound();
            }

            return Ok(JobApplicationToDTO(jobApplication));
        }

        // POST: api/JobApplications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<JobApplicationDTO>> PostJobApplication(JobApplicationDTO jobApplicationDTO)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (ownerId == null)
                return Unauthorized();
            ApplicationUser? user = await _context.Users.FindAsync(ownerId);
            if (user == null)
            {
                return NotFound("User not found");
            }
            var folderIds = jobApplicationDTO.Folders.Select(f => f.Id).ToList();

            var folders = await _context.ApplicationFolders
                .Where(f => folderIds.Contains(f.Id) && f.OwnerId == ownerId)
                .ToListAsync();
            
            JobApplication jobApplication = new JobApplication
            {
                Position = jobApplicationDTO.Position,
                CompanyName = jobApplicationDTO.CompanyName,
                Notes = jobApplicationDTO.Notes,
                Status = jobApplicationDTO.Status,
                Owner = user,
                OwnerId = user.Id,
                JobPostingUrl = jobApplicationDTO.JobPostingUrl,
                Folders = folders
            };

            _context.JobApplications.Add(jobApplication);
            await _context.SaveChangesAsync();

            return Ok(JobApplicationToDTO(jobApplication));
        }

        // DELETE: api/JobApplications/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJobApplication(Guid id)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (ownerId == null)
                return Unauthorized();
            ApplicationUser? user = await _context.Users.FindAsync(ownerId);
            if (user == null)
            {
                return NotFound("User not found");
            }


            JobApplication jobApplication = await _context.JobApplications
                .Include(j => j.Folders) 
                .FirstOrDefaultAsync(j => j.Id == id);
            if (jobApplication == null) return NotFound();

            if (jobApplication.OwnerId != ownerId) return Unauthorized("You do not have permission to delete this job application.");
           jobApplication.Folders.Clear(); 
            await _context.SaveChangesAsync();

            _context.JobApplications.Remove(jobApplication);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JobApplicationExists(Guid id)
        {
            return (_context.JobApplications?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static JobApplicationDTO JobApplicationToDTO(JobApplication jobApplication) =>
            new JobApplicationDTO
            {
                Id = jobApplication.Id,
                Position = jobApplication.Position,
                CompanyName = jobApplication.CompanyName,
                JobPostingUrl = jobApplication.JobPostingUrl,
                Notes = jobApplication.Notes,
                Status = jobApplication.Status,
                Folders = jobApplication.Folders?.Select(f => new FolderDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                }).ToList(),
            };
    }
}