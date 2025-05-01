using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class TakePartsRepository
    {
        private readonly ApplicationDbContext _context;

        public TakePartsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<TakePartDTO>> GetAllTakePartsAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var objquery = _context.TakeParts
                .Include(c => c.Participation)
                    .ThenInclude(c=>c.Coder)
                .Include(c => c.Problem)
               .Select(c => new TakePartDTO
               {
                   TakePartID = c.TakePartID,
                   ParticipationID = c.ParticipationID,
                   ProblemID = c.ProblemID,
                   CoderName = c.Participation.Coder.CoderName,
                   ProblemName = c.Problem.ProblemName,
                   
               });
            objquery = ApplySorting(objquery, sortField, ascending);
            var cat = await PagedResponse<TakePartDTO>.CreateAsync(
                objquery,
                query.Page,
                query.PageSize);
            return cat;
        }

        public IQueryable<TakePartDTO> ApplySorting(IQueryable<TakePartDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                _ => query.OrderBy(a => a.ProblemID)
            };
        }

        public async Task<TakePartDTO> CreateTakePartAsync(TakePartDTO dto)
        {

            TakePart existing = await IsTakePartExistAsync(dto.ParticipationID, dto.ProblemID);
            if (existing != null)
            {
                return new TakePartDTO
                {
                    TakePartID = existing.TakePartID,
                    ParticipationID = existing.ParticipationID,
                    ProblemID = existing.ProblemID
                };
            }
            TakePart takePart = new TakePart
            {
                ParticipationID = dto.ParticipationID,
                ProblemID = dto.ProblemID,
                SubmissionCount = 0,
                TimeSolved = 0,
                MaxPoint = 0,
                PointWon = 0,
                
            };
            _context.TakeParts.Add(takePart);
            await _context.SaveChangesAsync();

            return new TakePartDTO
            {
                TakePartID = takePart.TakePartID,
                ParticipationID = takePart.ParticipationID,
                ProblemID = takePart.ProblemID
            };

        }

        public async Task<TakePart> IsTakePartExistAsync(int partID, int problemID)
        {
            return await _context.TakeParts.FirstOrDefaultAsync(f => f.ProblemID == problemID && f.ParticipationID == partID);
        }

        public async Task<TakePartDTO> GetTakePartByIdAsync(int id)
        {
            var obj = await _context.TakeParts
                .Include(o => o.Problem)
                .Include(o => o.Participation)
                .FirstOrDefaultAsync(o => o.TakePartID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy");
            }

            return new TakePartDTO
            {
                CoderName = obj.Participation.Coder.CoderName,
                ParticipationID=obj.ParticipationID,
                ProblemID = obj.ProblemID,
                ProblemName = obj.Problem.ProblemName,
                PointWon=obj.PointWon,
                MaxPoint = obj.MaxPoint,
            };
        }
        public async Task<bool> DeleteTakePartAsync(int id)
        {
            var obj = await _context.TakeParts.FirstOrDefaultAsync(obj => obj.TakePartID== id);
            if (obj == null)
            {
                return false;
            }

            _context.TakeParts.Remove(obj);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<TakePartDTO> UpdateTakePartAsync(int id)
        {
            var takePart = await _context.TakeParts
                .Include(tp => tp.Participation)
                    .ThenInclude(p => p.Contest)
                .Include(tp => tp.Submissions)
                .FirstOrDefaultAsync(tp => tp.TakePartID == id);

            if (takePart == null)
                throw new KeyNotFoundException("Không tìm thấy.");
            
            var ruleType = takePart.Participation.Contest.RuleType;
            var penalty = takePart.Participation.Contest.FailedPenalty;
            takePart.SubmissionCount += 1;
            bool isAccepted = await CheckActualResult(id, takePart.ProblemID);

            if (ruleType == "ACM Rule")
            {
                takePart.MaxPoint = 1;
                takePart.PointWon = isAccepted ? 1 : 0;
                if (isAccepted)
                {
                    int wrongAttempts = takePart.SubmissionCount!.Value - 1;
                    takePart.TimeSolved += 20 * wrongAttempts;
                }

            }
            else if (ruleType == "Codeforces Rule")
            {
                var hasProblem = await _context.HasProblems
               .FirstOrDefaultAsync(h => h.ProblemID == takePart.ProblemID && h.ContestID == takePart.Participation.Contest.ContestID);
                int maxPoint = hasProblem!.Point;
                var contestStart = takePart.Participation.Contest.StartTime;
                var now = DateTime.UtcNow;
                int minutesPassed = (int)(now - contestStart).TotalMinutes;
                takePart.MaxPoint = maxPoint;
                takePart.TimeSolved = minutesPassed;
                if (isAccepted)
                {
                    int penaltyAttempts = takePart.SubmissionCount!.Value - 1;
                    double rawPoint = maxPoint - (4 * minutesPassed) - (50 * penaltyAttempts);

                    double minAllowed =maxPoint * 0.3;
                    takePart.PointWon = (int)Math.Max(rawPoint, minAllowed);
                }
                else
                {
                    takePart.PointWon = 0;
                }
            }

            await _context.SaveChangesAsync();
            return new TakePartDTO
            {
                TakePartID = takePart.TakePartID,
                PointWon = takePart.PointWon,
                MaxPoint = takePart.MaxPoint,
                SubmissionCount = takePart.SubmissionCount,
                TimeSolved = takePart.TimeSolved
            };
        }
        public async Task<bool> CheckActualResult(int takepartId, int problemId)
        {
            return await _context.Submissions
                .AnyAsync(s => s.TakePartID == takepartId && s.ProblemID == problemId && s.TestResult == "Accepted");
        }
        //public async Task<bool> GetRankListOfProblemAsync(int problemId)
        //{
        //    List<ParticipationDTO> list = _context.TakeParts
        //        .Include(tp => tp.Participation)
        //            .ThenInclude(tp=> tp.Coder)
        //        .Include(tp => tp.Submissions)
        //        .Where(tp=> tp.ProblemID == problemId)
        //}
    }
}
