using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;
using ntucoderbe.Models.ERD;
using ntucoderbe.Models;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class HasProblemRepository
    {
        private readonly ApplicationDbContext _context;

        public HasProblemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<HasProblemDTO>> GetAllHasProblemByContestIdAsync(int contestId, QueryObject query, string? sortField = null, bool ascending = true)
        {
            var objQuery = _context.HasProblems
                .Where(c => c.ContestID == contestId)
                .Include(c => c.Problem)
                .Include(c => c.Contest)
                .Select(c => new HasProblemDTO
                {
                    HasProblemID = c.HasProblemID,
                    ContestID = c.ContestID,
                    ProblemID = c.ProblemID,
                    ProblemName = c.Problem.ProblemName,
                    ContestName = c.Contest.ContestName,
                    ProblemOrder = c.ProblemOrder,
                    Point = c.Point,
                });

            objQuery = ApplySorting(objQuery, sortField, ascending);

            var obj = await PagedResponse<HasProblemDTO>.CreateAsync(
                objQuery,
                query.Page,
                query.PageSize);

            return obj;
        }


        public IQueryable<HasProblemDTO> ApplySorting(IQueryable<HasProblemDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "problemorder" => ascending ? query.OrderBy(a => a.ProblemOrder) : query.OrderByDescending(a => a.ProblemOrder),
                _ => query.OrderBy(a => a.HasProblemID)
            };
        }

        public async Task<HasProblemDTO> CreateHasProblemAsync(HasProblemDTO dto)
        {

            if (dto.ProblemID.HasValue)
            {
                if (await IsProblemExistAsync(dto.ProblemID!.Value, dto.ContestID))
                {
                    throw new InvalidOperationException("Bài tập đã tồn tại");
                }
            }
            else
            {
                throw new ArgumentNullException("ProblemID hoặc ContestID bị thiếu");
            }

            var obj = new HasProblem
            {
                ContestID = dto.ContestID,
                ProblemID = dto.ProblemID ?? 0,
                Point = dto.Point ?? 0,
                ProblemOrder = dto.ProblemOrder ?? 0,
            };

            _context.HasProblems.Add(obj);
            await _context.SaveChangesAsync();
            return dto;
        }
        public async Task<bool> IsProblemExistAsync(int problemId, int contestId)
        {
            return await _context.HasProblems.AnyAsync(p => p.ProblemID == problemId && p.ContestID == contestId);
        }
        public async Task<HasProblemDTO> GetHasProblemByIdAsync(int id)
        {
            var obj = await _context.HasProblems.Include(o => o.Problem).Include(o => o.Contest).FirstOrDefaultAsync(o => o.HasProblemID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }

            return new HasProblemDTO
            {
                HasProblemID = obj.HasProblemID,
                ContestID = obj.ContestID,
                ProblemID = obj.ProblemID,
                ProblemName = obj.Problem.ProblemName,
                ContestName = obj.Contest.ContestName,
                ProblemOrder = obj.ProblemOrder,
                Point = obj.Point
            };
        }

        public async Task<HasProblemDTO> UpdateHasProblemAsync(int id, HasProblemDTO dto)
        {
            var obj = await _context.HasProblems.FirstOrDefaultAsync(c => c.HasProblemID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }
            obj.ProblemOrder = dto.ProblemOrder ?? obj.ProblemOrder;
            obj.Point = dto.Point ?? obj.Point;
            _context.HasProblems.Update(obj);
            await _context.SaveChangesAsync();

            return new HasProblemDTO
            {
                HasProblemID = obj.HasProblemID,
                ContestID = obj.ContestID,
                ProblemID = obj.ProblemID,
                ProblemOrder = obj.ProblemOrder,
                Point = obj.Point

            };
        }
        public async Task<int> GetTotalHasProblemByContestIdAsync(int contestId)
        {
            return await _context.HasProblems.CountAsync(c => c.ContestID == contestId);
        }
        public async Task<bool> DeleteHasProblemAsync(int id)
        {
            var obj = await _context.HasProblems.FirstOrDefaultAsync(c => c.HasProblemID == id);
            if (obj == null)
            {
                return false;
            }
            _context.HasProblems.Remove(obj);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
