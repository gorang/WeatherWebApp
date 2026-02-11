using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WeatherApp.API.Data;
using WeatherApp.API.Models;
using WeatherApp.API.Services;
using WeatherApp.API.Utils;

namespace WeatherApp.API.Controllers
{
    [ApiController]
    [Route("weather")]
    [Authorize] // All weather endpoints require login by default
    public class WeatherController : ControllerBase
    {
        private readonly OpenWeatherService _ow;
        private readonly AppDbContext _db;

        public WeatherController(OpenWeatherService ow, AppDbContext db)
        {
            _ow = ow;
            _db = db;
        }

        // Current weather by user location (lat/lon comes from browser geolocation)
        [HttpGet("current")]
        [AllowAnonymous] // Override [Authorize] on the controller in order to allow usage even when no user is logged in
        public async Task<ActionResult> GetCurrent([FromQuery] double lat, [FromQuery] double lon)
        {
            if (lat < -90 || lat > 90 || lon < -180 || lon > 180)
                return BadRequest("Invalid coordinates.");

            var result = await _ow.GetCurrentByLatLonAsync(lat, lon);
            return Ok(result);
        }

        // 5-day forecast by city with optional filter: fromUtc/toUtc for "time period" filtering (affects grid+chart)
        [HttpGet("forecast")]
        public async Task<ActionResult> GetForecast(
            [FromQuery] string city,
            [FromQuery] DateTime? fromUtc,
            [FromQuery] DateTime? toUtc)
        {
            var normalizedCity = CityNormalizer.Normalize(city);
            if (string.IsNullOrWhiteSpace(normalizedCity))
                return BadRequest("City is required.");

            try
            {
                var forecast = await _ow.GetForecast5DaysByCityAsync(normalizedCity);

                var points = forecast.Points.AsQueryable();
                if (fromUtc.HasValue) points = points.Where(p => p.DateTimeUtc >= fromUtc.Value);
                if (toUtc.HasValue) points = points.Where(p => p.DateTimeUtc <= toUtc.Value);

                var filtered = points.ToList();

                // Save the search (every user search should be stored in DB)
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                // Use current weather conditions from the first forecast point to store the search data
                var first = filtered.FirstOrDefault() ?? forecast.Points.FirstOrDefault();
                if (first != null)
                {
                    _db.WeatherSearches.Add(new WeatherSearch
                    {
                        UserId = userId,
                        City = normalizedCity,
                        SearchedAtUtc = DateTime.UtcNow,
                        ConditionMain = first.ConditionMain,
                        ConditionDescription = first.ConditionDescription,
                        TempC = first.TempC
                    });
                    await _db.SaveChangesAsync();
                }

                return Ok(new
                {
                    City = normalizedCity,
                    Points = filtered
                });
            }
            catch (ArgumentException ex)
            {
                return NotFound("City not found.");
            }
        }
    }
}
