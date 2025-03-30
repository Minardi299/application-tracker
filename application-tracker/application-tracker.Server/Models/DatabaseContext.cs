using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.Extensions.Logging;

namespace application_tracker.Server.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; } 
        public DbSet<TodoItem> TodoItems { get; set; }

        protected ApplicationDbContext()
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<TodoItem>().ToTable("TodoItem");
        }
    }
}
