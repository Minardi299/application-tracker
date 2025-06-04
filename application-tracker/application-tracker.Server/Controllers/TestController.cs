using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace application_tracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        // GET: api/Test
        [HttpGet]
        [Authorize]
        public IActionResult Get()
        {
            return Ok("This is a test endpoint. You are authenticated.");
        }
    }
}