using System;
using System.Security.Policy;
namespace application_tracker.Server.Models
{
    public class User
    {
        public int ID { get; private set; }
        private string? _username;
        public string? Username
        {
            get { return _username; }
            set { _username = value; }
        }
    }
}
