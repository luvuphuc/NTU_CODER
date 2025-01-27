using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;

namespace ntucoderbe.Infrashtructure.Services
{
    public interface IProblemService
    {
        Task<PagedResponse<ProblemDTO>> GetAllProblemsAsync(QueryObject query, string? sortField = null, bool ascending = true);
        Task<ProblemDTO?> GetProblemByIdAsync(int id);
        Task<ProblemDTO> CreateProblemAsync(ProblemDTO problemDto);
        Task<ProblemDTO?> UpdateProblemAsync(int id, ProblemDTO problemDto);
        Task<bool> DeleteProblemAsync(int id);
    }
}
