using ntucoderbe.DTOs;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public interface ICompilerRepository
    {
        Task<List<CompilerDTO>> GetAllCompilersAsync();
        Task<CompilerDTO?> GetCompilerByIdAsync(int id);
        Task<CompilerDTO> CreateCompilerAsync(CompilerDTO compilerDto);
        Task<CompilerDTO?> UpdateCompilerAsync(int id, CompilerDTO compilerDto);
        Task<bool> DeleteCompilerAsync(int id);
    }
}
