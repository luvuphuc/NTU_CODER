using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class TestRunRepository
    {
        private readonly ApplicationDbContext _context;

        public TestRunRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResponse<TestRunDTO>> GetAllTestRunsBySubmissionIdAsync(int submissionId, QueryObject query, string? sortField = null, bool ascending = true)
        {
            var objQuery = _context.TestRuns
                .Where(c => c.SubmissionID == submissionId)
                .Include(c => c.Submission)
                .Select(c => new TestRunDTO
                {
                    TestRunID = c.TestRunID,
                    SubmissionID = c.SubmissionID,
                    TestCaseID = c.TestCaseID,
                    TimeDuration = c.TimeDuration,
                    MemorySize = c.MemorySize,
                    TestOutput = c.TestOutput,
                    Result = c.Result,
                    CheckerLog = c.CheckerLog
                });

            var obj = await PagedResponse<TestRunDTO>.CreateAsync(
                objQuery,
                query.Page,
                query.PageSize);

            return obj;
        }

        public async Task<TestRun> CreateTestRunAsync(TestRun testRun)
        {
            try
            {
                _context.TestRuns.Add(testRun);
                await _context.SaveChangesAsync();
                return testRun;
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lưu Test Run: {ex.InnerException?.Message ?? ex.Message}");
            }
        }


        public async Task<TestRunDTO> GetTestRunByIdAsync(int id)
        {
            var obj = await _context.TestRuns.Include(o => o.Submission).FirstOrDefaultAsync(o => o.TestCaseID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }

            return new TestRunDTO
            {
                TestRunID = obj.TestRunID,
                SubmissionID = obj.SubmissionID,
                TestCaseID = obj.TestCaseID,
                TimeDuration = obj.TimeDuration,
                MemorySize = obj.MemorySize,
                TestOutput = obj.TestOutput,
                Result = obj.Result,
                CheckerLog = obj.CheckerLog
            };
        }
        public async Task<bool> DeleteTestRunAsync(int id)
        {
            var obj = await _context.TestRuns.FirstOrDefaultAsync(c => c.TestRunID == id);
            if (obj == null)
            {
                return false;
            }
            _context.TestRuns.Remove(obj);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
