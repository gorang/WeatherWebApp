namespace WeatherApp.API.Models
{
    public class WeatherSearch
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string City { get; set; } = default!;

        public DateTime SearchedAtUtc { get; set; }

        public string ConditionMain { get; set; } = default!; // Clear, Clouds, Rain, ...
        
        public string ConditionDescription { get; set; } = default!; // "broken clouds", ...

        public double TempC { get; set; }
    }
}
