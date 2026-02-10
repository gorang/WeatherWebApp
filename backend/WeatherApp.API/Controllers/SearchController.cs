using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WeatherApp.API.Data;
using WeatherApp.API.Dtos;

namespace WeatherApp.API.Controllers
{
    [ApiController]
    [Route("search")]
    [Authorize]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SearchController(AppDbContext db)
        {
            _db = db;
        }

        private int GetUserId()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(idStr))
                throw new InvalidOperationException("Missing user id claim.");

            return int.Parse(idStr);
        }

        // Search history display – retrieved from the database
        [HttpGet("history")]
        public async Task<ActionResult<List<SearchHistoryItemDto>>> GetHistory([FromQuery] int? limit)
        {
            var userId = GetUserId();
            var take = (limit.HasValue && limit.Value > 0) ? Math.Min(limit.Value, 500) : 200;

            var items = await _db.WeatherSearches
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.SearchedAtUtc)
                .Take(take)
                .Select(s => new SearchHistoryItemDto
                {
                    Id = s.Id,
                    City = s.City,
                    SearchedAtUtc = s.SearchedAtUtc,
                    ConditionMain = s.ConditionMain,
                    ConditionDescription = s.ConditionDescription,
                    TempC = s.TempC
                })
                .ToListAsync();

            return Ok(items);
        }

        // Top 3 cities, last 3 searches, distribution of conditions
        [HttpGet("statistics")]
        public async Task<ActionResult<SearchStatisticsDto>> GetStatistics()
        {
            var userId = GetUserId();

            var topCities = await _db.WeatherSearches
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .GroupBy(s => s.City)
                .Select(g => new TopCityDto
                {
                    City = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .ThenBy(x => x.City)
                .Take(3)
                .ToListAsync();

            var latestSearches = await _db.WeatherSearches
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.SearchedAtUtc)
                .Take(3)
                .Select(s => new LatestSearchDto
                {
                    City = s.City,
                    SearchedAtUtc = s.SearchedAtUtc,
                    ConditionMain = s.ConditionMain,
                    TempC = s.TempC
                })
                .ToListAsync();

            var distribution = await _db.WeatherSearches
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .GroupBy(s => s.ConditionMain)
                .Select(g => new ConditionDistributionDto
                {
                    ConditionMain = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .ThenBy(x => x.ConditionMain)
                .ToListAsync();

            return Ok(new SearchStatisticsDto
            {
                TopCities = topCities,
                LatestSearches = latestSearches,
                ConditionDistribution = distribution
            });
        }
    }
}
