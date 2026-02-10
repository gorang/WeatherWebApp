namespace WeatherApp.API.Dtos
{
    public class SearchHistoryItemDto
    {
        public int Id { get; set; }
        public string City { get; set; } = default!;
        public DateTime SearchedAtUtc { get; set; }
        public string ConditionMain { get; set; } = default!;
        public string ConditionDescription { get; set; } = default!;
        public double TempC { get; set; }
    }
}
