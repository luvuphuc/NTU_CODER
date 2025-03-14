using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class ContestRepository
    {
        private readonly ApplicationDbContext _context;

        public ContestRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResponse<ContestDTO>> GetAllContestsAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            await UpdateContestStatusesAsync();
            var contestQuery = _context.Contest
                .Include(c => c.Coder)
                .Select(c => new ContestDTO
                {
                    ContestID = c.ContestID,
                    CoderID = c.CoderID,
                    ContestName = c.ContestName,
                    StartTime = c.StartTime,
                    EndTime = c.EndTime,
                    Published = c.Published,
                    Status = c.Status,
                    Duration = c.Duration,
                    CoderName = c.Coder.CoderName
                });

            contestQuery = ApplySorting(contestQuery, sortField, ascending);
            var contests = await PagedResponse<ContestDTO>.CreateAsync(contestQuery, query.Page, query.PageSize);
            return contests;
        }

        public IQueryable<ContestDTO> ApplySorting(IQueryable<ContestDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "contestname" => ascending ? query.OrderBy(c => c.ContestName) : query.OrderByDescending(c => c.ContestName),
                "starttime" => ascending ? query.OrderBy(c => c.StartTime) : query.OrderByDescending(c => c.StartTime),
                _ => query.OrderBy(c => c.ContestID),
            };
        }
        public async Task<ContestDTO> CreateContestAsync(ContestDTO dto)
        {
            var contest = new Contest
            {
                CoderID = 1,
                ContestName = dto.ContestName!,
                ContestDescription = dto.ContestDescription,
                StartTime = dto.StartTime!,
                EndTime = dto.EndTime!,
                RuleType = dto.RuleType!,
                FailedPenalty = dto.FailedPenalty ?? 0,
                Published = dto.Published?? 0,
                Status = dto.Status ?? 2,
                Duration = dto.Duration ?? 0,
                RankingFinished = dto.RankingFinished,
                FrozenTime = dto.FrozenTime
            };

            _context.Contest.Add(contest);
            await _context.SaveChangesAsync();
            dto.ContestID = contest.ContestID;
            return dto;
        }
        public async Task<bool> DeleteContestAsync(int id)
        {
            var contest = await _context.Contest.FindAsync(id);

            if (contest == null)
            {
                return false;
            }
            _context.Contest.Remove(contest);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<ContestDTO> GetContestByIdAsync(int id)
        {
            var contest = await _context.Contest
                .Include(c => c.Coder)
                .FirstOrDefaultAsync(c => c.ContestID == id);

            if (contest == null)
            {
                throw new KeyNotFoundException("Không tìm thấy contest");
            }

            return new ContestDTO
            {
                ContestID = contest.ContestID,
                CoderID = contest.CoderID,
                ContestName = contest.ContestName,
                ContestDescription = contest.ContestDescription,
                StartTime = contest.StartTime,
                EndTime = contest.EndTime,
                RuleType = contest.RuleType,
                FailedPenalty = contest.FailedPenalty,
                Published = contest.Published,
                Status = contest.Status,
                Duration = contest.Duration,
                RankingFinished = contest.RankingFinished,
                FrozenTime = contest.FrozenTime,
                CoderName = contest.Coder.CoderName
            };
        }
        public async Task<ContestDTO> UpdateContestAsync(int id, ContestDTO dto)
        {
            var existing = await _context.Contest.FindAsync(id);

            if (existing == null)
            {
                throw new KeyNotFoundException("Không tìm thấy contest");
            }

            existing.ContestName = dto.ContestName ?? existing.ContestName;
            existing.ContestDescription = dto.ContestDescription ?? existing.ContestDescription;
            if (dto.StartTime != default(DateTime)) existing.StartTime = dto.StartTime;
            if (dto.EndTime != default(DateTime)) existing.EndTime = dto.EndTime;
            if (dto.FrozenTime != default(DateTime)) existing.FrozenTime = dto.FrozenTime;
            existing.RuleType = dto.RuleType ?? existing.RuleType;
            existing.FailedPenalty = dto.FailedPenalty ?? existing.FailedPenalty;
            existing.Published = dto.Published ?? existing.Published;
            existing.Status = dto.Status ?? existing.Status;
            existing.Duration = dto.Duration ?? existing.Duration;
            existing.RankingFinished = dto.RankingFinished ?? existing.RankingFinished;
            

            await _context.SaveChangesAsync();
            dto.ContestID = existing.ContestID;
            return dto;
        }
        private async Task UpdateContestStatusesAsync()
        {
            var now = DateTime.UtcNow;

            var contests = await _context.Contest.ToListAsync();
            foreach (var contest in contests)
            {
                int newStatus = contest.EndTime <= now ? 0 :
                                contest.StartTime > now ? 2 : 1;

                if (contest.Status != newStatus)
                {
                    contest.Status = newStatus;
                }
            }

            await _context.SaveChangesAsync();
        }

    }
}
