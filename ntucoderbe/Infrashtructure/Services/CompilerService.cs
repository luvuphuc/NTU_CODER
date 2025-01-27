using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;

namespace ntucoderbe.Infrashtructure.Services
{
    public class CompilerService : ICompilerService
    {
        private readonly ICompilerRepository _compilerRepository;

        public CompilerService(ICompilerRepository compilerRepository)
        {
            _compilerRepository = compilerRepository;
        }

        public async Task<List<CompilerDTO>> GetAllCompilersAsync()
        {
            return await _compilerRepository.GetAllCompilersAsync();
        }

        public async Task<CompilerDTO> CreateCompilerAsync(CompilerDTO compilerDto)
        {
            return await _compilerRepository.CreateCompilerAsync(compilerDto);
        }

        public async Task<CompilerDTO?> GetCompilerByIdAsync(int id)
        {
            return await _compilerRepository.GetCompilerByIdAsync(id);
        }

        public async Task<CompilerDTO?> UpdateCompilerAsync(int id, CompilerDTO compilerDto)
        {
            return await _compilerRepository.UpdateCompilerAsync(id, compilerDto);
        }

        public async Task<bool> DeleteCompilerAsync(int id)
        {
            return await _compilerRepository.DeleteCompilerAsync(id);
        }
    }

}
