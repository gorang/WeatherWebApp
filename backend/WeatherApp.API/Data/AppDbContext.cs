using Microsoft.EntityFrameworkCore;
using WeatherApp.API.Models;

namespace WeatherApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
        }

        // We'll add DbSet<User>, DbSet<WeatherSearch> here soon
        // public DbSet<User> Users => Set<User>();
        // public DbSet<WeatherSearch> WeatherSearches => Set<WeatherSearch>();
    }
}
