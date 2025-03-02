using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;
using ntucoderbe.Models.ERD;
using ntucoderbe.Models;
using Microsoft.EntityFrameworkCore;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class TestCaseRepository
    {
        private readonly ApplicationDbContext _context;

        public TestCaseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<TestCaseDTO>> GetAllTestCasesByProblemIdAsync(int problemId, QueryObject query, string? sortField = null, bool ascending = true)
        {
            var objQuery = _context.TestCases
                .Where(c => c.ProblemID == problemId)
                .Include(c => c.Problem)
                .Select(c => new TestCaseDTO
                {
                    TestCaseID = c.TestCaseID,
                    ProblemID = c.ProblemID,
                    TestCaseOrder = c.TestCaseOrder,
                    SampleTest = c.SampleTest,
                    PreTest = c.PreTest,
                    Input = c.Input,
                    Output = c.Output,
                    ProblemName = c.Problem.ProblemName
                });

            objQuery = ApplySorting(objQuery, sortField, ascending);

            var obj = await PagedResponse<TestCaseDTO>.CreateAsync(
                objQuery,
                query.Page,
                query.PageSize);

            return obj;
        }


        public IQueryable<TestCaseDTO> ApplySorting(IQueryable<TestCaseDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "testcaseorder" => ascending ? query.OrderBy(a => a.TestCaseOrder) : query.OrderByDescending(a => a.TestCaseOrder),
                _ => query.OrderBy(a => a.TestCaseID)
            };
        }

        public async Task<TestCaseDTO> CreateTestCaseAsync(TestCaseDTO dto)
        {
            var obj = new TestCase
            {
                ProblemID = dto.ProblemID!,
                TestCaseOrder = dto.TestCaseOrder,
                PreTest = dto.PreTest?? 0,
                SampleTest = dto.SampleTest ?? 0,
                Input = dto.Input!,
                Output = dto.Output!,
            };

            _context.TestCases.Add(obj);
            await _context.SaveChangesAsync();

            dto.TestCaseID = obj.TestCaseID;
            return dto;
        }

        public async Task<TestCaseDTO> GetTestCaseByIdAsync(int id)
        {
            var obj = await _context.TestCases.Include(o => o.Problem).FirstOrDefaultAsync(o => o.TestCaseID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }

            return new TestCaseDTO
            {
                TestCaseID = obj.TestCaseID,
                ProblemID = obj.ProblemID,
                TestCaseOrder = obj.TestCaseOrder,
                PreTest = obj.PreTest,
                SampleTest = obj.SampleTest,
                Input = obj.Input,
                Output = obj.Output,
                ProblemName = obj.Problem.ProblemName!,
            };
        }

        public async Task<TestCaseDTO> UpdateTestCaseAsync(int id, TestCaseDTO dto)
        {
            var obj = await _context.TestCases.FirstOrDefaultAsync(c => c.TestCaseID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }
            obj.Input = !string.IsNullOrWhiteSpace(dto.Input) ? dto.Input : obj.Input;
            obj.Output = !string.IsNullOrWhiteSpace(dto.Output) ? dto.Output : obj.Output;
            if (dto.TestCaseOrder != default)
            {
                obj.TestCaseOrder = dto.TestCaseOrder;
            }
            obj.SampleTest = dto.SampleTest ?? obj.SampleTest;
            obj.PreTest = dto.PreTest ?? obj.PreTest;

            if (dto.TestCaseOrder != default)
            {
                obj.TestCaseOrder = dto.TestCaseOrder;
            }
            _context.TestCases.Update(obj);
            await _context.SaveChangesAsync();

            return new TestCaseDTO
            {
                TestCaseID = obj.TestCaseID,
                TestCaseOrder = obj.TestCaseOrder,
                SampleTest = obj.SampleTest,
                Input = obj.Input,
                Output = obj.Output,
                PreTest = obj.PreTest,
          
            };
        }
        public async Task<int> GetTotalTestCasesByProblemIdAsync(int problemId)
        {
            return await _context.TestCases.CountAsync(tc => tc.ProblemID == problemId);
        }
        public async Task<bool> DeleteTestCaseAsync(int id)
        {
            var obj = await _context.TestCases.FirstOrDefaultAsync(c => c.TestCaseID == id);
            if (obj == null)
            {
                return false;
            }
            _context.TestCases.Remove(obj);
            await _context.SaveChangesAsync();

            return true;
        }

    }
}
