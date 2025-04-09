using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace application_tracker.Server.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<TodoItem> TodoItems { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<ApplicationFolder> ApplicationFolders { get; set; }

        protected ApplicationDbContext()
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //including this because overide is required
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TodoItem>().ToTable("TodoItem");

        }
    }
}
