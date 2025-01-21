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
                CompilerName = compilerDto.CompilerName,
                CompilerPath = compilerDto.CompilerPath,
                CompilerOption = compilerDto.CompilerOption,
                CompilerExtension = compilerDto.CompilerExtension
            };

            _context.Add(compiler);
            await _context.SaveChangesAsync();
            compilerDto.CompilerID = compiler.CompilerID; 
            return compilerDto;
        }

        public Task<bool> DeleteCompilerAsync(int id)
        {
            throw new NotImplementedException();
        }



        public Task<CompilerDTO?> GetCompilerByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<CompilerDTO?> UpdateCompilerAsync(int id, CompilerDTO compilerDto)
        {
            throw new NotImplementedException();
        }
    }
}
