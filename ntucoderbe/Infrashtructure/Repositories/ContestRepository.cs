using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Services;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using System;
using System.Security.Policy;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class ContestRepository
    {
        private readonly ApplicationDbContext _context;

        public ContestRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<ContestDTO>> GetAllContestsAsync(QueryObject query, string? sortField = null, bool ascending = true, bool published = false)
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
            if (published)
            {
                contestQuery = contestQuery.Where(c => c.Published == 1);
            }
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
                "status" => ascending
                    ? query.OrderBy(c => c.Status == 2 ? 0 : c.Status == 0 ? 1 : c.Status == 1 ? 2 : 3)
                    : query.OrderByDescending(c => c.Status == 2 ? 0 : c.Status == 0 ? 1 : c.Status == 1 ? 2 : 3),
                _ => query.OrderBy(c => c.ContestID),
            };
        }
        public async Task<ContestDTO> CreateContestAsync(ContestDTO dto)
        {
            if (dto.EndTime <= dto.StartTime)
            {
                throw new InvalidOperationException("Thời gian kết thúc phải lớn hơn thời gian bắt đầu.");
            }
            var contest = new Contest
            {
                CoderID = (int)dto.CoderID!,
                ContestName = dto.ContestName!,
                ContestDescription = dto.ContestDescription,
                StartTime = dto.StartTime.ToUniversalTime(),
                EndTime = dto.EndTime.ToUniversalTime(),
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

            existing.StartTime = dto.StartTime != default(DateTime)
                ? new DateTimeOffset(dto.StartTime, TimeSpan.FromHours(7)).UtcDateTime
                : existing.StartTime;

            existing.EndTime = dto.EndTime != default(DateTime)
                ? new DateTimeOffset(dto.EndTime, TimeSpan.FromHours(7)).UtcDateTime
                : existing.EndTime;

            existing.FrozenTime = dto.FrozenTime != default(DateTime)
                ? new DateTimeOffset(dto.FrozenTime, TimeSpan.FromHours(7)).UtcDateTime
                : existing.FrozenTime;

            existing.RuleType = dto.RuleType ?? existing.RuleType;
            existing.FailedPenalty = dto.FailedPenalty ?? existing.FailedPenalty;
            existing.Published = dto.Published ?? existing.Published;
            existing.Status = dto.Status ?? existing.Status;
            existing.Duration = dto.Duration ?? existing.Duration;
            existing.RankingFinished = dto.RankingFinished ?? existing.RankingFinished;

            if (existing.EndTime <= existing.StartTime)
            {
                throw new InvalidOperationException("Thời gian kết thúc phải lớn hơn thời gian bắt đầu.");
            }

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
        public async Task<List<ContestDTO>> GetUpcomingContest(QueryObject query)
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
                })
                .Where(c => c.Status == 2 && c.Published ==1)
                .OrderByDescending(c => c.ContestID)
                .Take(3);

            return await contestQuery.ToListAsync();
        }


    }
}
