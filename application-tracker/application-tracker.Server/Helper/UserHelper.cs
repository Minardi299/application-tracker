using System.Threading.Tasks;
using System.Collections.Generic;
using application_tracker.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace application_tracker.Server.Helper;
public static class UserHelper
{
    public static async Task PopulateNewUserAsync(ApplicationUser user, ApplicationDbContext dbContext)
    {
        ApplicationFolder defaultFolder = new ApplicationFolder
        {
            Name = "All",
            Owner = user,
            OwnerId = user.Id,
        };
        JobApplication defaultJob = new JobApplication
        {
            CompanyName = "FDM Group",
            Position = "Social Media Intern.",
            Notes = "",
            Status = ApplicationStatus.Wishlist,
            Owner = user,
            OwnerId = user.Id,
            JobPostingUrl = "",
        };

        defaultFolder.Applications.Add(defaultJob);
        defaultJob.Folders.Add(defaultFolder);
        await dbContext.ApplicationFolders.AddAsync(defaultFolder);
        await dbContext.JobApplications.AddAsync(defaultJob);


        await dbContext.SaveChangesAsync();
    }
}