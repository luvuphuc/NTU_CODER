using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;

namespace ntucoderbe.Infrashtructure.Services
{
    public interface ICompilerService
    {
        Task<PagedResponse<CompilerDTO>> GetAllCompilersAsync(QueryObject query, string? sortField = null, bool ascending = true);
        Task<CompilerDTO> CreateCompilerAsync(CompilerDTO compilerDto);
        Task<CompilerDTO?> GetCompilerByIdAsync(int id);
        Task<CompilerDTO?> UpdateCompilerAsync(int id, CompilerDTO compilerDto);
        Task<bool> DeleteCompilerAsync(int id);
    }
}
