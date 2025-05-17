using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class StatisticRepository
    {
        private readonly ApplicationDbContext _context;

        public StatisticRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CardStatisticDTO> GetTotalCardStatisticAsync()
        {
            int totalCoders = await _context.Coders.CountAsync();
            int totalProblems = await _context.Problems.CountAsync();
            int totalSubmissions = await _context.Submissions.CountAsync();
            int totalContests = await _context.Contest.CountAsync();

            return new CardStatisticDTO
            {
                TotalCoders = totalCoders,
                TotalProblems = totalProblems,
                TotalSubmissions = totalSubmissions,
                TotalContests = totalContests
            };
        }
        public async Task<List<UserGrowthDTO>> GetUserGrowthOverTimeAsync()
        {
            DateTime thirtyDaysAgo = DateTime.UtcNow.Date.AddDays(-29);

            List<UserGrowthDTO> data = await _context.Coders
                .Where(c => c.CreatedAt.Date >= thirtyDaysAgo)
                .GroupBy(c => new { c.CreatedAt.Year, c.CreatedAt.Month, c.CreatedAt.Day })
                .Select(g => new UserGrowthDTO
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Day = g.Key.Day,
                    NewUsers = g.Count()
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month).ThenBy(x => x.Day)
                .ToListAsync();

            return data;
        }
        public async Task<Dictionary<string, int>> GetSubmissionStatusBreakdownAsync()
        {
            Dictionary<string,int> data = await _context.Submissions
                .GroupBy(s => s.TestResult == "Accepted" ? "Accepted" : "Failed")
                .Select(g => new
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToDictionaryAsync(x => x.Status, x => x.Count);

            return data;
        }
        public async Task<List<TopProblemDTO>> GetTopProblemsBySubmissionAsync(int top = 5)
        {
            List<TopProblemDTO> data = await _context.Submissions
                .GroupBy(s => s.ProblemID)
                .Select(g => new TopProblemDTO
                {
                    ProblemId = g.Key,
                    SubmissionCount = g.Count()
                })
                .OrderByDescending(x => x.SubmissionCount)
                .Take(top)
                .ToListAsync();

            List<int> problemIds = data.Select(d => d.ProblemId).ToList();

            Dictionary<int, string> problems = await _context.Problems
                .Where(p => problemIds.Contains(p.ProblemID))
                .ToDictionaryAsync(p => p.ProblemID, p => p.ProblemName);

            foreach (TopProblemDTO d in data)
            {
                d.ProblemName = problems.ContainsKey(d.ProblemId) ? problems[d.ProblemId] : "Unknown";
            }

            return data;
        }
        public async Task<List<SubmissionActivityDTO>> GetSubmissionActivityOverTimeAsync()
        {
            DateTime thirtyDaysAgo = DateTime.UtcNow.Date.AddDays(-29);

            List<SubmissionActivityDTO> data = await _context.Submissions
                .Where(s => s.SubmitTime >= thirtyDaysAgo)
                .GroupBy(s => new { s.SubmitTime.Year, s.SubmitTime.Month, s.SubmitTime.Day })
                .Select(g => new SubmissionActivityDTO
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Day = g.Key.Day,
                    SubmissionCount = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ThenBy(x => x.Day)
                .ToListAsync();

            return data;
        }
    }
}
