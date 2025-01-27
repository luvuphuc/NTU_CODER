using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;

namespace ntucoderbe.Infrashtructure.Services
{
    public class ProblemService : IProblemService
    {
        private readonly IProblemRepository _problemRepository;

        public ProblemService(IProblemRepository problemRepository)
        {
            _problemRepository = problemRepository;
        }

        public async Task<ProblemDTO> CreateProblemAsync(ProblemDTO problemDto)
        {
            return await _problemRepository.CreateProblemAsync(problemDto);
        }

        public async Task<bool> DeleteProblemAsync(int id)
        {
            return await _problemRepository.DeleteProblemAsync(id);
        }

        public async Task<PagedResponse<ProblemDTO>> GetAllProblemsAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            return await _problemRepository.GetAllProblemsAsync(query, sortField, ascending);
        }

        public async Task<ProblemDTO?> GetProblemByIdAsync(int id)
        {
            return await _problemRepository.GetProblemByIdAsync(id);
        }

        public async Task<ProblemDTO?> UpdateProblemAsync(int id, ProblemDTO problemDto)
        {
            return await _problemRepository.UpdateProblemAsync(id, problemDto);
        }
    }
}
