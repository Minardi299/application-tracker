using System;
using System.ComponentModel.DataAnnotations;

namespace application_tracker.Server.Models
{
    public class UserRegistrationDTO
    {
        public required string UserName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public required string Email { get; set; }

        //this required makes sure it's not null at run time
        [Required(ErrorMessage = "Password is required")]
        //meanwhile this required makes sure it's not null at compile time
        public required string Password { get; set; }

        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string? ConfirmPassword { get; set; }
    }
}
