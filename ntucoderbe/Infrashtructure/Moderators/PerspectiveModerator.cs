using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace ntucoderbe.Infrashtructure.Moderators
{
    public class PerspectiveModerator
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public PerspectiveModerator(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["PerspectiveAPI:ApiKey"]!;
        }

        public async Task<(bool allowed, string? reason)> ModerateAsync(string content)
        {
            var requestBody = new
            {
                comment = new { text = content },
                requestedAttributes = new
                {
                    TOXICITY = new { },
                    INSULT = new { },
                    THREAT = new { }
                },
                languages = new[] { "en" }
            };

            var requestJson = JsonSerializer.Serialize(requestBody);
            var request = new HttpRequestMessage(HttpMethod.Post, $"https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key={_apiKey}")
            {
                Content = new StringContent(requestJson, Encoding.UTF8, "application/json")
            };

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorText = await response.Content.ReadAsStringAsync();
                return (false, $"Perspective API lỗi {response.StatusCode}: {errorText}");
            }

            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            var scores = json.GetProperty("attributeScores");

            float toxicityScore = scores.GetProperty("TOXICITY").GetProperty("summaryScore").GetProperty("value").GetSingle();
            float insultScore = scores.GetProperty("INSULT").GetProperty("summaryScore").GetProperty("value").GetSingle();
            float threatScore = scores.GetProperty("THREAT").GetProperty("summaryScore").GetProperty("value").GetSingle();

            var threshold = 0.4f;
            var reasons = new List<string>();

            if (toxicityScore >= threshold) reasons.Add($"TOXICITY: {toxicityScore:P0}");
            if (insultScore >= threshold) reasons.Add($"INSULT: {insultScore:P0}");
            if (threatScore >= threshold) reasons.Add($"THREAT: {threatScore:P0}");

            if (reasons.Any())
            {
                return (false, $"Vi phạm nội dung: {string.Join(", ", reasons)}");
            }

            return (true, null);
        }
    }

}
