using System.Globalization;

namespace WeatherApp.API.Utils
{
    // Normalizes city names in a consistent way when calling OpenWeather and saving to DB.
    // City names will be trimmed, multiple spaces collapsed and then normalized converted using Title Case
    // (e.g. "new york" -> "New York", "ZAGREB" -> "Zagreb" etc.)
    public static class CityNormalizer
    {
        public static string Normalize(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;

            // Trim + collapse whitespace
            var trimmed = input.Trim();
            var parts = trimmed.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var collapsed = string.Join(' ', parts);

            // Title-case each word (culture invariant behavior)
            var textInfo = CultureInfo.InvariantCulture.TextInfo;
            var lowered = collapsed.ToLowerInvariant();
            return textInfo.ToTitleCase(lowered);
        }
    }
}
