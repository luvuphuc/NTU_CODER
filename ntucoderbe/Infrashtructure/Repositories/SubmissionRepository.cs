using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Helpers;
using ntucoderbe.Infrastructure.Services;
using ntucoderbe.Models.ERD;
using ntucoderbe.Models;
using Microsoft.EntityFrameworkCore;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class SubmissionRepository
    {
        private readonly ApplicationDbContext _context;

        public SubmissionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<SubmissionDTO>> GetAllSubmissionsAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var objQuery = _context.Submissions
                .Include(a=> a.Problem)
                .Include(a=> a.Coder)
                .Select(a => new SubmissionDTO
                {
                    SubmissionID = a.SubmissionID,
                    ProblemID = a.ProblemID,
                    ProblemName = a.Problem.ProblemName,
                    CoderID = a.CoderID,
                    CoderName = a.Coder.CoderName,
                });
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
                "coderid" => ascending ? query.OrderBy(a => a.CoderID) : query.OrderByDescending(a => a.CoderID),
                "problemid" => ascending ? query.OrderBy(a => a.ProblemID) : query.OrderByDescending(a => a.ProblemID),
                _ => query.OrderBy(a => a.SubmissionID)
            };
        }
        
        public async Task<SubmissionDTO> CreateSubmissionAsync(SubmissionDTO dto)
        {
            var obj = new Submission
            {
                ProblemID = dto.ProblemID,
                CoderID = 1,
                CompilerID = dto.CompilerID,
                SubmitTime = DateTime.UtcNow,
                SubmissionCode = dto.SubmissionCode,
                SubmissionStatus = 0,
            };

            _context.Submissions.Add(obj);
            await _context.SaveChangesAsync();
            dto.SubmissionID = obj.SubmissionID;
            return dto;
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
                SubmitLineCount = obj.SubmitLineCount,
                TestRunCount = obj.TestRunCount,
                TestResult = obj.TestResult,
                MaxMemorySize = obj.MaxMemorySize,
                MaxTimeDuration = obj.MaxTimeDuration

            };
        }
        public async Task<SubmissionDTO> UpdateSubmissionAsync(int id, SubmissionDTO dto)
        {
            var obj = await _context.Submissions.FirstOrDefaultAsync(o => o.SubmissionID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy");
            }
            obj.CompilerID = dto.CompilerID != 0 ? dto.CompilerID : obj.CompilerID;
            obj.SubmissionCode = string.IsNullOrEmpty(dto.SubmissionCode) ? obj.SubmissionCode : dto.SubmissionCode;
            obj.SubmitTime = DateTime.UtcNow;
            obj.SubmissionStatus = dto.SubmissionStatus != 0 ? dto.SubmissionStatus : obj.SubmissionStatus;
            obj.SubmitLineCount = dto.SubmitLineCount ?? obj.SubmitLineCount;
            obj.TestRunCount = dto.TestRunCount ?? obj.TestRunCount;
            obj.TestResult = string.IsNullOrEmpty(dto.TestResult) ? obj.TestResult : dto.TestResult;
            obj.MaxMemorySize = string.IsNullOrEmpty(dto.MaxMemorySize) ? obj.MaxMemorySize : dto.MaxMemorySize;
            obj.MaxTimeDuration = string.IsNullOrEmpty(dto.MaxTimeDuration) ? obj.MaxTimeDuration : dto.MaxTimeDuration;
            await _context.SaveChangesAsync();

            return new SubmissionDTO
            {
                SubmissionID = obj.SubmissionID,
                CompilerID = obj.CompilerID,
                SubmissionCode = obj.SubmissionCode,
                SubmitTime = obj.SubmitTime,
                SubmissionStatus = obj.SubmissionStatus,
                SubmitLineCount = obj.SubmitLineCount,
                TestRunCount = obj.TestRunCount,
                TestResult = obj.TestResult,
                MaxMemorySize = obj.MaxMemorySize,
                MaxTimeDuration = obj.MaxTimeDuration
            };
        }

    }
}
