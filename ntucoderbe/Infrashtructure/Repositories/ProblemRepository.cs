using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;
using ntucoderbe.Models.ERD;
using ntucoderbe.Models;
using Microsoft.EntityFrameworkCore;
using Humanizer;
using Newtonsoft.Json;
using FluentValidation;
using FluentValidation.Results;
using ntucoderbe.Infrashtructure.Services;
using System.Security.Policy;
using Microsoft.AspNetCore.Mvc;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class ProblemRepository
    {
        private readonly ApplicationDbContext _context;
        public ProblemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<ProblemDTO>> GetAllProblemsAsync(
            QueryObject query,
            string? sortField = null,
            bool ascending = true,
            bool published = false,
            int[]? catList = null,
            bool? isSolved = null,
            int? coderID = null)
        {
            var baseQuery = _context.Problems
                .Include(p => p.Coder)
                .Include(p => p.ProblemCategories)
                    .ThenInclude(pc => pc.Category)
                .Include(p => p.Solveds)
                .AsQueryable();

            if (published)
            {
                baseQuery = baseQuery.Where(p => p.Published == 1);
            }
            if (catList != null && catList.Length > 0)
            {
                baseQuery = baseQuery.Where(p =>
                    p.ProblemCategories.Count(pc => catList.Contains(pc.CategoryID)) == catList.Length);
            }

            if (isSolved.HasValue)
            {
                if (!coderID.HasValue)
                {
                    baseQuery = _context.Problems.Where(p => false);
                }
                else
                {
                    if (isSolved.Value)
                    {
                        baseQuery = baseQuery.Where(p => p.Solveds.Any(sol => sol.CoderID == coderID.Value));
                    }
                    else
                    {
                        baseQuery = baseQuery.Where(p => !p.Solveds.Any(sol => sol.CoderID == coderID.Value));
                    }
                }
            }


            var problemQuery = baseQuery.Select(p => new ProblemDTO
            {
                ProblemID = p.ProblemID,
                ProblemCode = p.ProblemCode,
                ProblemName = p.ProblemName,
                TestType = p.TestType,
                Published = p.Published,
                CoderID = p.CoderID,
                CoderName = p.Coder.CoderName,
                ProblemContent = p.ProblemContent,
                SelectedCategoryIDs = p.ProblemCategories.Select(pc => pc.CategoryID).ToList(),
                SelectedCategoryNames = p.ProblemCategories.Select(pc => pc.Category.CatName).ToList()
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
                "problemid" => ascending ? query.OrderBy(p=>p.ProblemID) : query.OrderByDescending(p=>p.ProblemID),
                _ => query.OrderByDescending(p => p.ProblemID),
            };
        }

        public async Task<ProblemDTO> CreateProblemAsync(ProblemDTO dto)
        {
            if (await CheckProblemCodeExist(dto.ProblemCode!))
            {
                throw new ValidationException("Mã bài tập đã tồn tại.");
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
                CoderID = (int)dto.CoderID!,
                Published = dto.Published ?? 0,
                TestCompilerID = dto.TestCompilerID ?? 1!,
                TestProgCompile = dto.TestProgCompile
            };

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
                    };
                    _context.ProblemCategories.Add(problemCategory);
                }
                await _context.SaveChangesAsync();
            }

            return dto;
        }


        private async Task<bool> CheckProblemCodeExist(string pc)
        {
            return await _context.Problems.AnyAsync(p => p.ProblemCode == pc);
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
                SelectedCategoryIDs = problem.ProblemCategories.Select(pc => pc.Category.CategoryID).ToList(),
                SelectedCategoryNames = problem.ProblemCategories
                .Select(pc => pc.Category.CatName)
                .ToList(),
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
            existing.CoderID = dto.CoderID ?? existing.CoderID;
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
                        };
                        _context.ProblemCategories.Add(problemCategory);
                    }
                }
            }
            await _context.SaveChangesAsync();

            dto.ProblemID = existing.ProblemID;
            return dto;
        }
        public async Task<int> CountSolvedProblemAsync(int id)
        {
            return await _context.Solved.CountAsync(s=>s.ProblemID == id);
        }
        public async Task<int> CountAllProblemAsync()
        {
            return await _context.Problems.CountAsync();
        }
        public async Task<List<RankingDTO>> GetRankingListByProblemIdAsync(int problemID, int? contestID = null)
        {
            List<RankingDTO> rankings;

            if (contestID.HasValue)
            {
                rankings = await _context.TakeParts
                 .Include(tp => tp.Submissions)
                    .ThenInclude(s=>s.Compiler)
                 .Include(tp => tp.Participation)
                     .ThenInclude(p => p.Coder)
                 .Where(tp => tp.ProblemID == problemID && tp.Participation.ContestID == contestID && tp.PointWon > 0)
                 .Select(tp => new RankingDTO
                 {
                     CoderName = tp.Participation.Coder.CoderName,
                     Avatar = tp.Participation.Coder.Avatar,
                     PointScore = tp.PointWon,
                     CompilerName = tp.Submissions
                        .OrderBy(s => s.MaxTimeDuration)
                        .Select(s => s.Compiler.CompilerName) 
                        .FirstOrDefault(),
                     TimeScore = tp.Submissions
                         .OrderBy(s => s.MaxTimeDuration)
                         .Select(s => s.MaxTimeDuration)
                         .FirstOrDefault() ?? int.MaxValue
                 })
                 .ToListAsync();
                rankings = rankings
                    .OrderByDescending(r => r.PointScore)
                    .ThenBy(r => r.TimeScore)
                    .ToList();
            }

            else
            {
                List<Submission> acceptedSubmissions = await _context.Submissions
                    .Where(s => s.ProblemID == problemID && s.TestResult == "Accepted" && s.TakePartID ==null)
                    .Include(s => s.Coder)
                    .Include(s => s.Compiler)
                    .ToListAsync();
                rankings = acceptedSubmissions
                    .GroupBy(s => s.CoderID)
                    .Select(g => g.OrderBy(s => s.MaxTimeDuration).First())
                    .Select(s => new RankingDTO
                    {
                        CoderName = s.Coder.CoderName,
                        Avatar = s.Coder.Avatar,
                        PointScore = 10,
                        CompilerName = s.Compiler.CompilerName,
                        TimeScore = s.MaxTimeDuration ?? int.MaxValue
                    })
                    .OrderBy(r => r.TimeScore)
                    .ToList();
            }
            int rank = 1;
            foreach (var r in rankings)
            {
                r.Rank = rank++;
            }
            return rankings;
        }
    }
}
