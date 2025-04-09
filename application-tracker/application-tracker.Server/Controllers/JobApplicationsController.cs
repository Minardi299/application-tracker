using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using application_tracker.Server.Models;

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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobApplicationDTO>>> GetJobApplications()
        {
          if (_context.JobApplications == null)
          {
              return NotFound();
          }
            return await _context.JobApplications
            .Select(x => JobApplicationToDTO(x))
            .ToListAsync();
        }

        // GET: api/JobApplications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<JobApplicationDTO>> GetJobApplication(long id)
        {
          if (_context.JobApplications == null)
          {
              return NotFound();
          }
            var jobApplication = await _context.JobApplications.FindAsync(id);

            if (jobApplication == null)
            {
                return NotFound();
            }

            return JobApplicationToDTO(jobApplication);
        }

        // PUT: api/JobApplications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJobApplication(long id, JobApplicationDTO jobApplicationDTO)
        {
            if (id != jobApplicationDTO.Id)
            {
                return BadRequest();
            }

            var jobApplication = await _context.JobApplications.FindAsync(id);
            if (jobApplication == null)
            {
                return NotFound();
            }

            jobApplication.Position = jobApplicationDTO.Position;
            jobApplication.CompanyName = jobApplicationDTO.CompanyName;
            jobApplication.Notes = jobApplicationDTO.Notes;
            jobApplication.Status = jobApplicationDTO.Status;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobApplicationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/JobApplications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<JobApplicationDTO>> PostJobApplication(long userId, JobApplicationDTO jobApplicationDTO)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }
            
            var jobApplication = new JobApplication
            {
                Position = jobApplicationDTO.Position,
                CompanyName = jobApplicationDTO.CompanyName,
                Notes = jobApplicationDTO.Notes,
                Status = jobApplicationDTO.Status,
                Owner = user,
                OwnerId = user.Id
            };

            _context.JobApplications.Add(jobApplication);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobApplication), new { id = jobApplication.Id }, JobApplicationToDTO(jobApplication));
        }

        // DELETE: api/JobApplications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJobApplication(long id)
        {
            if (_context.JobApplications == null)
            {
                return NotFound();
            }
            var jobApplication = await _context.JobApplications.FindAsync(id);
            if (jobApplication == null)
            {
                return NotFound();
            }

            _context.JobApplications.Remove(jobApplication);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JobApplicationExists(long id)
        {
            return (_context.JobApplications?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static JobApplicationDTO JobApplicationToDTO(JobApplication jobApplication) =>
            new JobApplicationDTO
            {
                Id = jobApplication.Id,
                Position = jobApplication.Position,
                CompanyName = jobApplication.CompanyName,
                Notes = jobApplication.Notes,
                Status = jobApplication.Status,
            };
    }
}