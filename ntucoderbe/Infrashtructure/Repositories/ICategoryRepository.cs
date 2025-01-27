using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;

namespace ntuCategorybe.Infrashtructure.Repositories
{
    public interface ICategoryRepository
    {
        Task<PagedResponse<CategoryDTO>> GetAllCategoriesAsync(QueryObject query, string? sortField = null, bool ascending = true);
        Task<CategoryDTO> CreateCategoryAsync(CategoryDTO dto);
        Task<CategoryDTO> GetCategoryByIdAsync(int id);
        Task<CategoryDTO> UpdateCategoryAsync(int id, CategoryDTO dto);
        Task<bool> DeleteCategoryAsync(int id);
    }
}
