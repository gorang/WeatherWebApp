using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// Only for test purposes. TODO: remove this controller when not needed any more.
namespace WeatherApp.API.Controllers
{
    [ApiController]
    [Route("test")]
    public class TestController : ControllerBase
    {
        [Authorize]
        [HttpGet("me")]
        public ActionResult GetMe()
        {
            return Ok(new
            {
                userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
                username = User.Identity?.Name
            });
        }
    }
}
