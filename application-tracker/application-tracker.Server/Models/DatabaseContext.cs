using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace application_tracker.Server.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<TodoItem> TodoItems { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<ApplicationFolder> ApplicationFolders { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //including this because overide is required
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TodoItem>().ToTable("TodoItem");
            modelBuilder.Entity<ApplicationUser>()
                .Property(u => u.Email)
                .IsRequired();

            modelBuilder
                .Entity<JobApplication>()
                .HasMany(j => j.Folders)
                .WithMany(f => f.Applications)
                .UsingEntity<Dictionary<string, object>>(
                    "ApplicationFolderJobApplication",
                    j =>
                        j.HasOne<ApplicationFolder>()
                            .WithMany()
                            .HasForeignKey("FoldersId")
                            .OnDelete(DeleteBehavior.Restrict),
                    f =>
                        f.HasOne<JobApplication>()
                            .WithMany()
                            .HasForeignKey("ApplicationsId")
                            .OnDelete(DeleteBehavior.Restrict)
                );
        }
    }
}
