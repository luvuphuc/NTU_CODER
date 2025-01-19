using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;

namespace ntucoderbe.Infrashtructure.Services
{
    public interface ICoderService
    {
        Task<CreateCoderDTO> CreateCoderAsync(CreateCoderDTO dto);
        Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true);
        Task<CoderDTO> GetCoderByIdAsync(int id);
        Task<CoderDetailDTO> UpdateCoderAsync(int id, CoderDetailDTO dto);
        Task<bool> DeleteCoderAsync(int id);
    }
}
