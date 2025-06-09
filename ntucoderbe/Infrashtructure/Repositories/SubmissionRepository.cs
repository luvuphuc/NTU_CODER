using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Helpers;
using ntucoderbe.Infrastructure.Services;
using ntucoderbe.Models.ERD;
using ntucoderbe.Models;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.Infrashtructure.Services;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class SubmissionRepository
    {
        private readonly ApplicationDbContext _context;

        public SubmissionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<SubmissionDTO>> GetAllSubmissionsAsync(
            QueryObject query,
            string? sortField = null,
            bool ascending = true,
            string? searchString = null,
            string? compilerFilter = null)
        {
            var objQuery = _context.Submissions
                .Include(a => a.Problem)
                .Include(a => a.Coder)
                .Include(a => a.Compiler)
                .Select(a => new SubmissionDTO
                {
                    SubmissionID = a.SubmissionID,
                    ProblemID = a.ProblemID,
                    ProblemName = a.Problem.ProblemName,
                    CoderID = a.CoderID,
                    CoderName = a.Coder.CoderName,
                    CompilerName = a.Compiler.CompilerName,
                    TestResult = a.TestResult,
                    MaxTimeDuration = a.MaxTimeDuration,
                    SubmitTime = a.SubmitTime,
                    SubmissionStatus = a.SubmissionStatus,
                });
            if (!string.IsNullOrWhiteSpace(searchString))
            {
                var lowerSearch = searchString.ToLower();
                objQuery = objQuery.Where(c =>
                    c.CoderName!.ToLower().Contains(lowerSearch) ||
                    c.ProblemName!.ToLower().Contains(lowerSearch));
            }
            if (!string.IsNullOrWhiteSpace(compilerFilter))
            {
                var lowerCompiler = compilerFilter.ToLower();
                objQuery = objQuery.Where(c =>
                    c.CompilerName!.ToLower().Contains(lowerCompiler));
            }

            objQuery = ApplySorting(objQuery, sortField, ascending);

            var obj = await PagedResponse<SubmissionDTO>.CreateAsync(
                objQuery,
                query.Page,
                query.PageSize);
            return obj;
        }

        public IQueryable<SubmissionDTO> ApplySorting(IQueryable<SubmissionDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "codername" => ascending ? query.OrderBy(a => a.CoderName) : query.OrderByDescending(a => a.CoderName),
                "problemname" => ascending ? query.OrderBy(a => a.ProblemName) : query.OrderByDescending(a => a.ProblemName),
                "submittime" => ascending ? query.OrderBy(a => a.SubmitTime) : query.OrderByDescending(a => a.SubmitTime),
                "maxtimeduration" => ascending ? query.OrderBy(a => a.MaxTimeDuration) : query.OrderByDescending(a => a.MaxTimeDuration),
                _ => query.OrderByDescending(a => a.SubmissionID)
            };
        }

        public async Task<SubmissionDTO> CreateSubmissionAsync(SubmissionDTO dto)
        {
            //if (await IsSubmissionExistAsync(dto.ProblemID, dto.CoderID,dto.TakePartID))
            //{
            //    return await UpdateSubmissionAsync(dto);
            //}
            if (dto.TakePartID.HasValue)
            {
                if (await CheckAcceptedSubmissionAsync(dto.TakePartID.Value, dto.ProblemID))
                {
                    throw new InvalidOperationException("Bạn đã nộp bài trước đó");
                }
            }

            Submission obj = new Submission
            {
                ProblemID = dto.ProblemID,
                CoderID = dto.CoderID,
                TakePartID = dto.TakePartID ?? null,
                CompilerID = dto.CompilerID,
                SubmitTime = DateTime.UtcNow,
                SubmissionCode = dto.SubmissionCode,
                SubmissionStatus = 0,
            };

            _context.Submissions.Add(obj);
            if (dto.TakePartID == null && !(await IsSolved(dto.ProblemID, dto.CoderID)))
            {
                var solved = new Solved
                {
                    ProblemID = dto.ProblemID,
                    CoderID = dto.CoderID,
                };
                _context.Solved.Add(solved);
            }

            await _context.SaveChangesAsync();
            dto.SubmissionID = obj.SubmissionID;
            return dto;
        }
        public async Task<bool> CheckAcceptedSubmissionAsync(int takepartId, int problemId)
        {
            return await _context.Submissions
                .AnyAsync(s => s.TakePartID == takepartId && s.ProblemID == problemId && s.TestResult == "Accepted");
        }
        private async Task<bool> IsSolved(int problemID, int coderID)
        {
            return await _context.Solved.AnyAsync(s => s.ProblemID == problemID && s.CoderID == coderID);
        }
        public async Task<bool> DeleteSubmissionAsync(int id)
        {
            var obj = await _context.Submissions.FirstOrDefaultAsync(o => o.SubmissionID == id);
            if (obj == null)
            {
                return false;
            }
            _context.Submissions.Remove(obj);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<SubmissionDTO> GetSubmissionByIdAsync(int id)
        {
            var obj = await _context.Submissions
                .Include(o=>o.Problem)
                .Include(o=>o.Compiler)
                .Include(o=>o.Coder)
                .FirstOrDefaultAsync(o => o.SubmissionID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy");
            }

            return new SubmissionDTO
            {
                SubmissionID = obj.SubmissionID,
                CoderName = obj.Coder.CoderName,
                CoderID = obj.CoderID,
                CompilerName = obj.Compiler.CompilerName,
                ProblemID = obj.ProblemID,
                ProblemName = obj.Problem.ProblemName,
                CompilerID = obj.CompilerID,
                SubmissionCode = obj.SubmissionCode,
                SubmitTime = obj.SubmitTime,
                SubmissionStatus = obj.SubmissionStatus,
                TestRunCount = obj.TestRunCount,
                TestResult = obj.TestResult,
                MaxTimeDuration = obj.MaxTimeDuration

            };
        }
        public async Task<SubmissionDTO> UpdateSubmissionAsync(SubmissionDTO dto)
        {
            var obj = await _context.Submissions
        .FirstOrDefaultAsync(o => o.CoderID == dto.CoderID && o.ProblemID == dto.ProblemID);

            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy Submission.");
            }

            obj.CompilerID = dto.CompilerID != 0 ? dto.CompilerID : obj.CompilerID;
            obj.SubmissionCode = string.IsNullOrEmpty(dto.SubmissionCode) ? obj.SubmissionCode : dto.SubmissionCode;
            obj.SubmitTime = DateTime.UtcNow;
            obj.SubmissionStatus = dto.SubmissionStatus != 0 ? dto.SubmissionStatus : obj.SubmissionStatus;
            obj.TestRunCount = dto.TestRunCount ?? obj.TestRunCount;
            obj.TestResult = string.IsNullOrEmpty(dto.TestResult) ? obj.TestResult : dto.TestResult;
  
            if (obj.TestRuns.Any())
            {
                obj.MaxTimeDuration = obj.TestRuns.Max(tr => tr.TimeDuration);
            }
            else
            {
                obj.MaxTimeDuration = 0;
            }

            await _context.SaveChangesAsync();

            return new SubmissionDTO
            {
                SubmissionID = obj.SubmissionID,
                CompilerID = obj.CompilerID,
                SubmissionCode = obj.SubmissionCode,
                SubmitTime = obj.SubmitTime,
                SubmissionStatus = obj.SubmissionStatus,
                TestRunCount = obj.TestRunCount,
                TestResult = obj.TestResult,
                MaxTimeDuration = obj.MaxTimeDuration
            };
        }
        public async Task UpdateSubmissionAfterTestRunAsync(int submissionId)
        {
            var obj = await _context.Submissions
                .Include(s => s.TestRuns)
                .FirstOrDefaultAsync(s => s.SubmissionID == submissionId);

            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy Submission.");
            }

            obj.TestRunCount = obj.TestRuns.Count;

            if (obj.TestRuns.Any(tr => tr.Result != "Accepted"))
            {
                obj.MaxTimeDuration = 0;
                obj.TestResult = "Failed";
            }
            else
            {
                if (obj.TestRuns.Any())
                {
                    obj.MaxTimeDuration = obj.TestRuns.Max(tr => tr.TimeDuration);
                }
                else
                {
                    obj.MaxTimeDuration = 0;
                }
                obj.TestResult = "Accepted";
            }

            obj.SubmissionStatus = 1;

            await _context.SaveChangesAsync();
        }

        public async Task<List<SubmissionDTO>> GetListSubmissionFromCoderIdAsync(int problemId, int coderId, int? takePart = null, string? sortField = null, bool ascending = true)
        {
            IQueryable<Submission> query = _context.Submissions
                .Include(c => c.Compiler)
                .Include(c => c.TakePart)
                .Where(s => s.ProblemID == problemId && s.CoderID == coderId);

            if (takePart != null)
            {
                query = query.Where(s => s.TakePartID == takePart);
            }

            List<SubmissionDTO> listDTO = await query.Select(obj => new SubmissionDTO
            {
                SubmissionID = obj.SubmissionID,
                CompilerID = obj.CompilerID,
                CompilerName = obj.Compiler.CompilerName,
                SubmissionCode = obj.SubmissionCode,
                SubmitTime = obj.SubmitTime,
                SubmissionStatus = obj.SubmissionStatus,
                TestRunCount = obj.TestRunCount,
                TestResult = obj.TestResult,
                MaxTimeDuration = obj.MaxTimeDuration,
                Point = (takePart != null) ? obj.TakePart.PointWon : (obj.TestResult == "Accepted" ? 10 : 0),
            }).ToListAsync();
            IQueryable<SubmissionDTO> queryDTO = listDTO.AsQueryable();
            queryDTO = ApplySorting(queryDTO, sortField, ascending);

            return queryDTO.ToList();
        }
        public async Task<List<SubmissionDTO>> GetListSubmissionByCoderId(int coderId)
        {
            return await _context.Submissions
                .Include(c=> c.Problem)
                .Where(c => c.CoderID == coderId) 
                .OrderByDescending(c => c.SubmissionID)
                .Select(c => new SubmissionDTO
                {
                    SubmissionID = c.SubmissionID,
                    ProblemName = c.Problem.ProblemName,
                    SubmissionStatus = c.SubmissionStatus,
                    SubmitTime = c.SubmitTime,
                    TestResult = c.TestResult,

                })
        .ToListAsync();
        }
    }
}
