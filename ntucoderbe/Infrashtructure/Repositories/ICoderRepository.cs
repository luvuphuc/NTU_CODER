using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public interface ICoderRepository
    {
        Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query,string? sortField= null, bool ascending = true);
        Task<CreateCoderDTO> CreateCoderAsync(CreateCoderDTO dto);
        Task<CoderDTO> GetCoderByIdAsync(int  id);
        Task<CoderDTO> UpdateCoderAsync(int id, CreateCoderDTO dto);
        Task<CoderDTO> DeleteCoderAsync(int id);

    }
}
