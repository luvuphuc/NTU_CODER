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

            var problems = await _context.Problems
                .Where(p => p.ProblemName.ToLower().Contains(searchString))
                .Select(p => new SearchResultDTO
                {
                    Type = "Problem",
                    ID = p.ProblemID,
                    Name = p.ProblemName
                }).ToListAsync();

            var contests = await _context.Contest
                .Where(c => c.ContestName.ToLower().Contains(searchString))
                .Select(c => new SearchResultDTO
                {
                    Type = "Contest",
                    ID = c.ContestID,
                    Name = c.ContestName
                }).ToListAsync();

            return problems.Concat(contests)
                           .OrderBy(r => r.Name)
                           .ToList();
        }
    }
}
