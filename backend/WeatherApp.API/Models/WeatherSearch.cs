namespace WeatherApp.API.Models
{
    public class WeatherSearch
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string City { get; set; } = default!;

        public DateTime SearchedAtUtc { get; set; }

        // Basic conditions at search time (enough for "latest searches" and condition distribution)
        public string ConditionMain { get; set; } = default!; // e.g. Clear, Clouds, Rain
        public string ConditionDescription { get; set; } = default!; // e.g. "broken clouds"

        public double TempC { get; set; }
    }
}
