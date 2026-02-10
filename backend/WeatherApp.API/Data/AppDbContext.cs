using Microsoft.EntityFrameworkCore;

namespace WeatherApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // We'll add DbSet<User>, DbSet<WeatherSearch> here soon
        // public DbSet<User> Users => Set<User>();
        // public DbSet<WeatherSearch> WeatherSearches => Set<WeatherSearch>();
    }
}
