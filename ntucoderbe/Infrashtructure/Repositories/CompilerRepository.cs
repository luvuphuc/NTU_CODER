using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class CompilerRepository : ICompilerRepository
    {
        private readonly ApplicationDbContext _context;

        public CompilerRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<CompilerDTO>> GetAllCompilersAsync()
        {
            var compilers = await _context.Compilers
                .AsNoTracking()
                .Select(c => new CompilerDTO
                {
                    CompilerID = c.CompilerID,
                    CompilerName = c.CompilerName,
                    CompilerPath = c.CompilerPath,
                    CompilerOption = c.CompilerOption,
                    CompilerExtension = c.CompilerExtension
                })
                .ToListAsync();

            return compilers;
        }
        public async Task<CompilerDTO> CreateCompilerAsync(CompilerDTO compilerDto)
        {
            var compiler = new Compiler
            {
                CompilerName = compilerDto.CompilerName!,
                CompilerPath = compilerDto.CompilerPath!,
                CompilerOption = compilerDto.CompilerOption,
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
                    CompilerPath = c.CompilerPath,
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

            if (!string.IsNullOrEmpty(compilerDto.CompilerPath))
                existingCompiler.CompilerPath = compilerDto.CompilerPath;

            if (compilerDto.CompilerOption != 0)
                existingCompiler.CompilerOption = compilerDto.CompilerOption;

            if (!string.IsNullOrEmpty(compilerDto.CompilerExtension))
                existingCompiler.CompilerExtension = compilerDto.CompilerExtension;

            _context.Update(existingCompiler);
            await _context.SaveChangesAsync();

            compilerDto.CompilerID = existingCompiler.CompilerID;
            return compilerDto;
        }

    }
}
