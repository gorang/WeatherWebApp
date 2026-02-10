namespace WeatherApp.API.Services
{
    public class OpenWeatherService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;

        public OpenWeatherService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _config = config;
        }

        private string BaseUrl => _config["OpenWeather:BaseUrl"] ?? "https://api.openweathermap.org/data/2.5";
        private string ApiKey => _config["OpenWeather:ApiKey"]
            ?? throw new InvalidOperationException("OpenWeather API key missing (OpenWeather:ApiKey).");

        public async Task<CurrentWeatherResult> GetCurrentByLatLonAsync(double lat, double lon)
        {
            var url = $"{BaseUrl}/weather?lat={lat}&lon={lon}&appid={ApiKey}&units=metric";
            var dto = await _http.GetFromJsonAsync<CurrentWeatherDto>(url)
                      ?? throw new InvalidOperationException("OpenWeather returned empty response.");

            return MapCurrent(dto);
        }

        public async Task<ForecastResult> GetForecast5DaysByCityAsync(string city)
        {
            var url = $"{BaseUrl}/forecast?q={Uri.EscapeDataString(city)}&appid={ApiKey}&units=metric";
            var dto = await _http.GetFromJsonAsync<ForecastDto>(url)
                      ?? throw new InvalidOperationException("OpenWeather returned empty response.");

            return MapForecast(dto);
        }

        private static CurrentWeatherResult MapCurrent(CurrentWeatherDto dto)
        {
            var w = dto.weather?.FirstOrDefault();
            return new CurrentWeatherResult(
                City: dto.name ?? "",
                TempC: dto.main?.temp ?? 0,
                ConditionMain: w?.main ?? "Unknown",
                ConditionDescription: w?.description ?? "Unknown"
            );
        }

        private static ForecastResult MapForecast(ForecastDto dto)
        {
            var cityName = dto.city?.name ?? "";
            var items = (dto.list ?? new List<ForecastItemDto>())
                .Where(i => i.dt_txt != null)
                .Select(i =>
                {
                    var w = i.weather?.FirstOrDefault();
                    return new ForecastPoint(
                        DateTimeUtc: DateTime.SpecifyKind(DateTime.Parse(i.dt_txt!), DateTimeKind.Utc),
                        TempC: i.main?.temp ?? 0,
                        ConditionMain: w?.main ?? "Unknown",
                        ConditionDescription: w?.description ?? "Unknown"
                    );
                })
                .ToList();

            return new ForecastResult(cityName, items);
        }

        // Records (simple API-facing models)
        public record CurrentWeatherResult(string City, double TempC, string ConditionMain, string ConditionDescription);
        public record ForecastResult(string City, List<ForecastPoint> Points);
        public record ForecastPoint(DateTime DateTimeUtc, double TempC, string ConditionMain, string ConditionDescription);

        // Minimal DTOs matching OpenWeather JSON (only fields we need)
        private class CurrentWeatherDto
        {
            public string? name { get; set; }
            public MainDto? main { get; set; }
            public List<WeatherDto>? weather { get; set; }
        }

        private class ForecastDto
        {
            public CityDto? city { get; set; }
            public List<ForecastItemDto>? list { get; set; }
        }

        private class CityDto { public string? name { get; set; } }

        private class ForecastItemDto
        {
            public MainDto? main { get; set; }
            public List<WeatherDto>? weather { get; set; }
            public string? dt_txt { get; set; }
        }

        private class MainDto { public double temp { get; set; } }
        private class WeatherDto { public string? main { get; set; } public string? description { get; set; } }
    }
}
