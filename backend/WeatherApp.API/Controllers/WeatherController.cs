using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WeatherApp.API.Data;
using WeatherApp.API.Models;
using WeatherApp.API.Services;

namespace WeatherApp.API.Controllers
{
    [ApiController]
    [Route("weather")]
    [Authorize] // all weather endpoints require login
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
        public async Task<ActionResult> GetCurrent([FromQuery] double lat, [FromQuery] double lon)
        {
            var result = await _ow.GetCurrentByLatLonAsync(lat, lon);
            return Ok(result);
        }

        // 5-day forecast by city
        // Optional filter: fromUtc/toUtc for "time period" filtering (affects grid+chart later)
        [HttpGet("forecast")]
        public async Task<ActionResult> GetForecast(
            [FromQuery] string city,
            [FromQuery] DateTime? fromUtc,
            [FromQuery] DateTime? toUtc)
        {
            if (string.IsNullOrWhiteSpace(city))
                return BadRequest("City is required.");

            var forecast = await _ow.GetForecast5DaysByCityAsync(city);

            var points = forecast.Points.AsQueryable();
            if (fromUtc.HasValue) points = points.Where(p => p.DateTimeUtc >= fromUtc.Value);
            if (toUtc.HasValue) points = points.Where(p => p.DateTimeUtc <= toUtc.Value);

            var filtered = points.ToList();

            // Save the search (requirement: every user search stored in DB)
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Use "current-ish" conditions from the first forecast point to store something meaningful
            var first = filtered.FirstOrDefault() ?? forecast.Points.FirstOrDefault();
            if (first != null)
            {
                _db.WeatherSearches.Add(new WeatherSearch
                {
                    UserId = userId,
                    City = forecast.City,
                    SearchedAtUtc = DateTime.UtcNow,
                    ConditionMain = first.ConditionMain,
                    ConditionDescription = first.ConditionDescription,
                    TempC = first.TempC
                });
                await _db.SaveChangesAsync();
            }

            return Ok(new
            {
                City = forecast.City,
                Points = filtered
            });
        }
    }
}
