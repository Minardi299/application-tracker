namespace ApplicationTracker.Server.Helper;

 using System.Threading.Tasks;
using System.Collections.Generic;
 using application_tracker.Server.Models;
 using Microsoft.EntityFrameworkCore;

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
        var defaultJob = new JobApplication
    {
        CompanyName = "FDM Group",
        Position = "Social Media Intern.",
        Notes = "",
        Status = ApplicationStatus.Wishlist,
        Owner = user,
        OwnerId = user.Id,
        JobPostingUrl = "",
        Folders = new List<ApplicationFolder> { defaultFolder } 
    };

        defaultFolder.Applications = new List<JobApplication> { defaultJob };
        await dbContext.ApplicationFolders.AddAsync(defaultFolder);
        await dbContext.JobApplications.AddAsync(defaultJob);


        await dbContext.SaveChangesAsync();
    }
}