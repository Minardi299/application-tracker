using System.Threading.Tasks;
using System.Collections.Generic;
using application_tracker.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace application_tracker.Server.Helper;
public static class GeneralHelper
{
    public static string GenerateSlug(string name)
    {
        return name.ToLower().Replace(" ", "-").Replace("/", "").Replace("\\", ""); // sanitize more if needed
    }
}