using AddressManagementSystem.Infrashtructure.Helpers;
using Humanizer;
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

        public async Task<PagedResponse<ContestDTO>> GetAllContestsAsync(QueryObject query, string? sortField = null, bool ascending = true, bool published = false, int? status = null,string? searchString = null)
        {
            await UpdateContestStatusesAsync();
            var contestQuery = _context.Contest
                .Include(c=>c.Participations)
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
                    CoderName = c.Coder.CoderName,
                    ContestDescription = c.ContestDescription,
                    ParticipationCount = c.Participations.Count()
                });
            if (published)
            {
                contestQuery = contestQuery.Where(c => c.Published == 1);
            }
            if (!string.IsNullOrWhiteSpace(searchString))
            {
                contestQuery = contestQuery.Where(c => c.ContestName!.ToLower().Contains(searchString.ToLower()));
            }
            if (status.HasValue)
            {
                contestQuery = contestQuery.Where(c => c.Status == status.Value);
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
                _ => query.OrderByDescending(c => c.ContestID),
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
                ? dto.StartTime.ToUniversalTime()
                : existing.StartTime;

            existing.EndTime = dto.EndTime != default(DateTime)
                ? dto.EndTime.ToUniversalTime()
                : existing.EndTime;

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
        public async Task<List<ContestDTO>> GetUpcomingContest()
        {
            await UpdateContestStatusesAsync();
            IQueryable<ContestDTO> contestQuery = _context.Contest
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
                .Where(c => c.Status == 2 && c.Published == 1)
                .OrderByDescending(c => c.ContestID)
                .Take(3);

            return await contestQuery.ToListAsync();
        }
        public async Task<List<ContestDTO>> GetOnGoingContest()
        {
            await UpdateContestStatusesAsync();
            IQueryable<ContestDTO> contestQuery = _context.Contest
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
                    CoderName = c.Coder.CoderName,
                    ContestDescription = c.ContestDescription,
                    ParticipationCount = c.Participations.Count()
                })
                .Where(c => c.Status == 1 && c.Published == 1)
                .OrderByDescending(c => c.ContestID);

            return await contestQuery.ToListAsync();
        }
        public async Task<int> CountParticipationInContestAsync(int contestID)
        {
            return await _context.Participations
                .CountAsync(p => p.ContestID == contestID);
        }

        public async Task<List<RankingDTO>> GetListRankingByContestIdAsync(int contestID)
        {
            List<RankingDTO> rankings = await _context.Participations
                .Where(p => p.ContestID == contestID)
                .Include(p => p.Coder)
                .Include(p => p.TakeParts)
                .OrderBy(p => p.Rank)
                .Select(p => new RankingDTO
                {
                    CoderID = p.CoderID,
                    CoderName = p.Coder.CoderName,
                    ParticipationID = p.ParticipationID,
                    PointScore = p.PointScore,
                    TimeScore = p.TimeScore,
                    Avatar = p.Coder.Avatar,
                    Rank = p.Rank ?? 0,
                    SolvedCount = p.SolvedCount,

                    TakeParts = p.TakeParts
                        .Join(_context.HasProblems.Where(hp => hp.ContestID == contestID),
                              tp => tp.ProblemID,
                              hp => hp.ProblemID,
                              (tp, hp) => new { tp, hp.ProblemOrder })
                        .OrderBy(x => x.ProblemOrder) 
                        .Select(x => new TakePartDTO
                        {
                            ProblemID = x.tp.ProblemID,
                            PointWon = x.tp.PointWon,
                            TimeSolved = x.tp.TimeSolved,
                            SubmissionCount = x.tp.SubmissionCount
                        })
                        .ToList()
                })
                .ToListAsync();

            return rankings;
        }
        public async Task<List<RankingDTO>> GetHighestRankedCoderInAllContestsAsync()
        {
            var highestRanking = await _context.Participations
                .Include(p => p.Coder)
                .GroupBy(p => p.CoderID)
                .Select(group => new RankingDTO
                {
                    CoderID = group.Key,
                    CoderName = group.FirstOrDefault().Coder.CoderName,
                    Avatar = group.FirstOrDefault().Coder.Avatar,
                    PointScore = group.Sum(p => p.PointScore), 
                })
                .OrderByDescending(p => p.PointScore) 
                .ToListAsync(); 
            int rank = 1;
            foreach (var item in highestRanking)
            {
                item.Rank = rank++; 
            }

            return highestRanking;
        }

    }

}
