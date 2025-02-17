using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;
using ntucoderbe.Models.ERD;
using ntucoderbe.Models;
using Microsoft.EntityFrameworkCore;
using Humanizer;
using ntucoderbe.Validator;
using Newtonsoft.Json;
using FluentValidation;
using FluentValidation.Results;
using ntucoderbe.Infrashtructure.Services;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class ProblemRepository : IProblemRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly AuthService _authService;
        public ProblemRepository(ApplicationDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        public async Task<PagedResponse<ProblemDTO>> GetAllProblemsAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var problemQuery = _context.Problems
                .Include(p=>p.Coder)
                .Select(p => new ProblemDTO
                {
                    ProblemID = p.ProblemID,
                    ProblemCode = p.ProblemCode,
                    ProblemName = p.ProblemName,
                    TestType = p.TestType,
                    Published = p.Published,
                    CoderID = p.CoderID,
                    CoderName = p.Coder.CoderName
                });

            problemQuery = ApplySorting(problemQuery, sortField, ascending);
            var problems = await PagedResponse<ProblemDTO>.CreateAsync(
                problemQuery,
                query.Page,
                query.PageSize);
            return problems;
        }

        public IQueryable<ProblemDTO> ApplySorting(IQueryable<ProblemDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "problemcode" => ascending ? query.OrderBy(p => p.ProblemCode) : query.OrderByDescending(p => p.ProblemCode),
                "problemname" => ascending ? query.OrderBy(p => p.ProblemName) : query.OrderByDescending(p => p.ProblemName),
                _ => query.OrderBy(p => p.ProblemID),
            };
        }

        public async Task<ProblemDTO> CreateProblemAsync(ProblemDTO dto)
        {
            var validator = new ProblemValidator();
            var validationResult = await validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }
            if (await CheckProblemCodeExist(dto.ProblemCode!))
            {
                validationResult.Errors.Add(new ValidationFailure("ProblemCode", "Mã bài tập đã tồn tại."));
                throw new ValidationException(validationResult.Errors);
            }
            var problem = new Problem
            {
                ProblemCode = dto.ProblemCode!,
                ProblemName = dto.ProblemName!,
                TimeLimit = dto.TimeLimit ?? 1,
                MemoryLimit = dto.MemoryLimit ?? 128!,
                ProblemContent = dto.ProblemContent!,
                ProblemExplanation = dto.ProblemExplanation!,
                TestType = dto.TestType!,
                TestCode = dto.TestCode!,
                CoderID = _authService.GetUserIdFromSession()!.Value,
                Published = 0,
                TestCompilerID = dto.TestCompilerID ?? 1!,
                TestProgCompile = dto.TestProgCompile
            };;

            _context.Problems.Add(problem);
            await _context.SaveChangesAsync();
            dto.ProblemID = problem.ProblemID;

            if (dto.SelectedCategoryIDs.Any())
            {
                foreach (var categoryId in dto.SelectedCategoryIDs)
                {
                    var problemCategory = new ProblemCategory
                    {
                        ProblemID = problem.ProblemID,
                        CategoryID = categoryId,
                        Note = dto.Note,
                    };
                    _context.ProblemCategories.Add(problemCategory);
                }
                await _context.SaveChangesAsync();
            }

            return dto;
        }


        public async Task<bool> CheckProblemCodeExist(string pc)
        {
            return await _context.Problems.AnyAsync(p=>p.ProblemCode == pc);
        }
        public async Task<bool> DeleteProblemAsync(int id)
        {
            var problem = await _context.Problems
                .Include(p => p.ProblemCategories)
                .FirstOrDefaultAsync(p => p.ProblemID == id);

            if (problem == null)
            {
                return false;
            }
            if (problem.ProblemCategories != null && problem.ProblemCategories.Any())
            {
                _context.ProblemCategories.RemoveRange(problem.ProblemCategories);
            }
            _context.Problems.Remove(problem);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<ProblemDTO> GetProblemByIdAsync(int id)
        {
            var problem = await _context.Problems
             .Where(p => p.ProblemID == id)
             .Include(p => p.ProblemCategories)
                .ThenInclude(pc => pc.Category)
             .Include(c => c.Coder)
             .Include(com => com.Compiler)
             
             .FirstOrDefaultAsync();

            if (problem == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bài tập");
            }

            return new ProblemDTO
            {
                ProblemCode = problem.ProblemCode!,
                ProblemName = problem.ProblemName!,
                TimeLimit = problem.TimeLimit,
                MemoryLimit = problem.MemoryLimit,
                ProblemContent = problem.ProblemContent!,
                ProblemExplanation = problem.ProblemExplanation!,
                TestType = problem.TestType!,
                TestCode = problem.TestCode!,
                CoderID = problem.CoderID,
                Published = problem.Published,
                TestCompilerID = problem.TestCompilerID,
                CoderName = problem.Coder.CoderName,
                TestCompilerName = problem.Compiler.CompilerName,
                SelectedCategoryNames = problem.ProblemCategories
                .Select(pc => pc.Category.CatName)
                .ToList(),
                Note = problem.ProblemCategories.Select(pc => pc.Note).FirstOrDefault()
            };
        }

        public async Task<ProblemDTO> UpdateProblemAsync(int id, ProblemDTO dto)
        {

            var existing = await _context.Problems
                .Include(p => p.ProblemCategories)
                .FirstOrDefaultAsync(p => p.ProblemID == id);

            if (existing == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bài tập.");
            }
            var validator = new ProblemValidator(true);
            var validationResult = await validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }
            if (!string.IsNullOrEmpty(dto.ProblemCode) && existing.ProblemCode != dto.ProblemCode)
            {
                if (await CheckProblemCodeExist(dto.ProblemCode!))
                {
                    throw new InvalidOperationException("Mã bài tập đã tồn tại.");
                }
                existing.ProblemCode = dto.ProblemCode!;
            }
            existing.ProblemName = dto.ProblemName ?? existing.ProblemName;
            existing.ProblemContent = dto.ProblemContent ?? existing.ProblemContent;
            existing.TimeLimit = dto.TimeLimit ?? existing.TimeLimit;
            existing.MemoryLimit = dto.MemoryLimit ?? existing.MemoryLimit;
            existing.ProblemExplanation = dto.ProblemExplanation ?? existing.ProblemExplanation;
            existing.TestType = dto.TestType ?? existing.TestType;
            existing.TestCode = dto.TestCode ?? existing.TestCode;
            existing.TestCompilerID = dto.TestCompilerID ?? existing.TestCompilerID;
            existing.Published = dto.Published ?? existing.Published;

            if (dto.SelectedCategoryIDs != null && dto.SelectedCategoryIDs.Any())
            {
                var existingCategoryIds = existing.ProblemCategories.Select(pc => pc.CategoryID).ToList();
                if (!dto.SelectedCategoryIDs.SequenceEqual(existingCategoryIds))
                {
                    _context.ProblemCategories.RemoveRange(existing.ProblemCategories);

                    foreach (var categoryId in dto.SelectedCategoryIDs)
                    {
                        var problemCategory = new ProblemCategory
                        {
                            ProblemID = existing.ProblemID,
                            CategoryID = categoryId,
                            Note  = dto.Note,
                        };
                        _context.ProblemCategories.Add(problemCategory);
                    }
                }
            }
            await _context.SaveChangesAsync();

            dto.ProblemID = existing.ProblemID; 
            return dto;
        }
    }
}
