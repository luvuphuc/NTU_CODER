using ntucoderbe.DTOs;

namespace ntucoderbe.Infrashtructure.Services
{
    public interface ICompilerService
    {
        Task<List<CompilerDTO>> GetAllCompilersAsync();
        Task<CompilerDTO> CreateCompilerAsync(CompilerDTO compilerDto);
        Task<CompilerDTO?> GetCompilerByIdAsync(int id);
        Task<CompilerDTO?> UpdateCompilerAsync(int id, CompilerDTO compilerDto);
        Task<bool> DeleteCompilerAsync(int id);
    }
}
