using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using Humanizer;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class CompilerRepository
    {
        private readonly ApplicationDbContext _context;

        public CompilerRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResponse<CompilerDTO>> GetAllCompilersAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var compilerQuery = _context.Compilers
                .AsNoTracking()
                .Select(c => new CompilerDTO
                {
                    CompilerID = c.CompilerID,
                    CompilerName = c.CompilerName,
                    CompilerOption = c.CompilerOption,
                    CompilerExtension = c.CompilerExtension
                });

            compilerQuery = ApplySorting(compilerQuery, sortField, ascending);

            var compilers = await PagedResponse<CompilerDTO>.CreateAsync(
                compilerQuery,
                query.Page,
                query.PageSize);

            return compilers;
        }

        public IQueryable<CompilerDTO> ApplySorting(IQueryable<CompilerDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "compilername" => ascending ? query.OrderBy(c => c.CompilerName) : query.OrderByDescending(c => c.CompilerName),
                _ => query.OrderBy(c => c.CompilerID)
            };
        }
        public async Task<CompilerDTO> CreateCompilerAsync(CompilerDTO compilerDto)
        {
            var compiler = new Compiler
            {
                CompilerName = compilerDto.CompilerName!,
                CompilerOption = compilerDto.CompilerOption ?? 0,
                CompilerExtension = compilerDto.CompilerExtension
            };

            _context.Add(compiler);
            await _context.SaveChangesAsync();
            compilerDto.CompilerID = compiler.CompilerID; 
            return compilerDto;
        }

        public async Task<bool> DeleteCompilerAsync(int id)
        {
            var compiler = await _context.Compilers.FindAsync(id);
            if (compiler == null) return false;

            _context.Compilers.Remove(compiler);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<CompilerDTO?> GetCompilerByIdAsync(int id)
        {
            var compiler = await _context.Compilers
                .AsNoTracking()
                .Where(c => c.CompilerID == id)
                .Select(c => new CompilerDTO
                {
                    CompilerID = c.CompilerID,
                    CompilerName = c.CompilerName,
                    CompilerOption = c.CompilerOption,
                    CompilerExtension = c.CompilerExtension
                })
                .FirstOrDefaultAsync();

            return compiler;
        }


        public async Task<CompilerDTO?> UpdateCompilerAsync(int id, CompilerDTO compilerDto)
        {
            var existingCompiler = await _context.Compilers.FindAsync(id);
            if (existingCompiler == null) return null;
            if (!string.IsNullOrEmpty(compilerDto.CompilerName))
                existingCompiler.CompilerName = compilerDto.CompilerName;

            if (compilerDto.CompilerOption != 0)
                existingCompiler.CompilerOption = compilerDto.CompilerOption?? 0;

            if (!string.IsNullOrEmpty(compilerDto.CompilerExtension))
                existingCompiler.CompilerExtension = compilerDto.CompilerExtension;

            _context.Update(existingCompiler);
            await _context.SaveChangesAsync();

            compilerDto.CompilerID = existingCompiler.CompilerID;
            return compilerDto;
        }

    }
}
