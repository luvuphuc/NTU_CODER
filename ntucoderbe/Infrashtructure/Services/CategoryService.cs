using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using FluentValidation.Results;
using ntuCategorybe.Infrashtructure.Repositories;
using ntucoderbe.DTOs;

namespace ntucoderbe.Infrashtructure.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<PagedResponse<CategoryDTO>> GetAllCategoriesAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            return await _categoryRepository.GetAllCategoriesAsync(query, sortField, ascending);
        }

        public async Task<CategoryDTO> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(id);
            if (category == null)
            {
                throw new KeyNotFoundException("Không tìm thấy thể loại.");
            }
            return category;
        }

        public async Task<CategoryDTO> CreateCategoryAsync(CategoryDTO dto)
        {
            var errors = new List<ValidationFailure>();

            if (string.IsNullOrWhiteSpace(dto.CatName))
            {
                errors.Add(new ValidationFailure("CatName", "Tên thể loại không được để trống."));
            }

            if (!dto.CatOrder.HasValue)
            {
                errors.Add(new ValidationFailure("CatOrder", "Thứ tự không được để trống."));
            }

            if (errors.Count > 0)
            {
                throw new ValidationException(errors);
            }

            return await _categoryRepository.CreateCategoryAsync(dto);
        }

        public async Task<CategoryDTO> UpdateCategoryAsync(int id, CategoryDTO dto)
        {
            return await _categoryRepository.UpdateCategoryAsync(id, dto);
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var isDeleted = await _categoryRepository.DeleteCategoryAsync(id);
            if (!isDeleted)
            {
                throw new KeyNotFoundException("Không tìm thấy thể loại.");
            }
            return true;
        }
    }
}
