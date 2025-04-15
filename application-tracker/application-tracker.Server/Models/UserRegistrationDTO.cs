using System;
using System.ComponentModel.DataAnnotations;

namespace application_tracker.Server.Models
{
    public class UserRegistrationDTO
    {
        public string UserName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }

        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string? ConfirmPassword { get; set; }
    }
}
