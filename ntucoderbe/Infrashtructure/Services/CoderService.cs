using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;

namespace ntucoderbe.Infrashtructure.Services
{
    public class CoderService : ICoderService
    {
        private readonly ICoderRepository _coderRepository;

        public CoderService(ICoderRepository coderRepository)
        {
            _coderRepository = coderRepository;
        }

        public async Task<CreateCoderDTO> CreateCoderAsync(CreateCoderDTO dto)
        {
            return await _coderRepository.CreateCoderAsync(dto);
        }

        public async Task<CoderDTO> DeleteCoderAsync(int id)
        {
            return await _coderRepository.DeleteCoderAsync(id);
        }

        public async Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            return await _coderRepository.GetAllCoderAsync(query, sortField, ascending);
        }

        public async Task<CoderDTO> GetCoderByIdAsync(int id)
        {
            return await _coderRepository.GetCoderByIdAsync(id);
        }

        public async Task<CoderDTO> UpdateCoderAsync(int id, CreateCoderDTO dto)
        {
            return await _coderRepository.UpdateCoderAsync(id, dto);
        }
    }
}
