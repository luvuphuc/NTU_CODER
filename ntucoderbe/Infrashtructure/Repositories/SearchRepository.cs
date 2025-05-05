using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class SearchRepository
    {
        private readonly ApplicationDbContext _context;

        public SearchRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<SearchResultDTO>> SearchAsync(string searchString)
        {
            if (string.IsNullOrWhiteSpace(searchString))
                return new List<SearchResultDTO>();

            searchString = searchString.ToLower();

            List<SearchResultDTO> problems = await _context.Problems
                .Where(p => p.ProblemName.ToLower().Contains(searchString) && p.Published == 1)
                .Select(p => new SearchResultDTO
                {
                    Type = "Bài tập",
                    Url = "problem",
                    ID = p.ProblemID,
                    Name = p.ProblemName
                }).ToListAsync();

            List<SearchResultDTO> contests = await _context.Contest
                .Where(c => c.ContestName.ToLower().Contains(searchString))
                .Select(c => new SearchResultDTO
                {
                    Type = "Kì thi",
                    Url = "contest",
                    ID = c.ContestID,
                    Name = c.ContestName
                }).ToListAsync();
            List<SearchResultDTO> users = await _context.Coders
                .Where(c => c.CoderName.ToLower().Contains(searchString))
                .Select(c => new SearchResultDTO
                {
                    Type = "Coder",
                    Url = "user",
                    ID = c.CoderID,
                    Name = c.CoderName
                }).ToListAsync();
            return problems.Concat(contests)
                            .Concat(users)
                           .OrderBy(r => r.Name)
                           .ToList();
        }
    }
}
