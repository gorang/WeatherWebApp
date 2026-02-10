namespace WeatherApp.API.Dtos
{
    public class SearchStatisticsDto
    {
        public List<TopCityDto> TopCities { get; set; } = new();
        public List<LatestSearchDto> LatestSearches { get; set; } = new();
        public List<ConditionDistributionDto> ConditionDistribution { get; set; } = new();
    }

    public class TopCityDto
    {
        public string City { get; set; } = default!;
        public int Count { get; set; }
    }

    public class LatestSearchDto
    {
        public string City { get; set; } = default!;
        public DateTime SearchedAtUtc { get; set; }
        public string ConditionMain { get; set; } = default!;
        public double TempC { get; set; }
    }

    public class ConditionDistributionDto
    {
        public string ConditionMain { get; set; } = default!;
        public int Count { get; set; }
    }
}
