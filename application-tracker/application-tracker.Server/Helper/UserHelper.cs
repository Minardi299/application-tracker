using System.Threading.Tasks;
using System.Collections.Generic;
using application_tracker.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace application_tracker.Server.Helper;
public static class UserHelper
{
    public static async Task PopulateNewUserAsync(ApplicationUser user, ApplicationDbContext dbContext)
    {
        if (dbContext.Entry(user).State == EntityState.Detached)
        {
            dbContext.Attach(user);
        }
        ApplicationFolder defaultFolder = new ApplicationFolder
        {
            Name = "Favorites",
            Owner = user,
            OwnerId = user.Id,
        };
        ApplicationFolder defaultFolder2 = new ApplicationFolder
        {
            Name = "Archived",
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
        JobApplication defaultJob2 = new JobApplication
        {
            CompanyName = "Google",
            Position = "Software Engineer",
            Notes = "Applied through referral",
            Status = ApplicationStatus.Applied,
            Owner = user,
            OwnerId = user.Id,
            JobPostingUrl = "https://careers.google.com/jobs/results/1234567890-software-engineer/",
        };
        JobApplication defaultJob3 = new JobApplication
        {
            CompanyName = "Microsoft",
            Position = "Data Scientist",
            Notes = "Interview scheduled for next week",
            Status = ApplicationStatus.Rejected,
            Owner = user,
            OwnerId = user.Id,
            JobPostingUrl = "https://careers.microsoft.com/jobs/results/0987654321-data-scientist/",
        };

        defaultFolder.Applications.Add(defaultJob);
        defaultFolder.Applications.Add(defaultJob2);
        defaultFolder2.Applications.Add(defaultJob2);
        defaultFolder2.Applications.Add(defaultJob3);
        using var transaction = await dbContext.Database.BeginTransactionAsync();
        try
        {
            await dbContext.ApplicationFolders.AddRangeAsync(defaultFolder, defaultFolder2);
            await dbContext.JobApplications.AddRangeAsync(defaultJob, defaultJob2, defaultJob3);
            await dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}