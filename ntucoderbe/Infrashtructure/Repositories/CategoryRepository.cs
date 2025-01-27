using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.EntityFrameworkCore;
using ntuCategorybe.Infrashtructure.Repositories;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<CategoryDTO>> GetAllCategoriesAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var catQuery = _context.Categories
               .Select(c => new CategoryDTO
               {
                  CategoryID = c.CategoryID,
                  CatName = c.CatName,
                  CatOrder = c.CatOrder,
               });
            catQuery = ApplySorting(catQuery, sortField, ascending);
            var cat = await PagedResponse<CategoryDTO>.CreateAsync(
                catQuery,
                query.Page,
                query.PageSize);
            return cat;
        }

        public IQueryable<CategoryDTO> ApplySorting(IQueryable<CategoryDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "catorder" => ascending ? query.OrderBy(a => a.CatOrder) : query.OrderByDescending(a => a.CatOrder),
                _ => query.OrderBy(a => a.CategoryID)
            };
        }

        public async Task<CategoryDTO> CreateCategoryAsync(CategoryDTO dto)
        {
            if (await IsCategoryNameExistAsync(dto.CatName))
            {
                throw new InvalidOperationException("Tên danh mục đã tồn tại.");
            }
            if (dto.CatOrder <= 0)
            {
                throw new InvalidOperationException("Thứ tự phải là một số nguyên dương.");
            }
            var category = new Category
            {
                CatName = dto.CatName,
                CatOrder = dto.CatOrder
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            dto.CategoryID = category.CategoryID;
            return dto;
        }
        public async Task<bool> IsCategoryNameExistAsync(string catName)
        {
            return await _context.Categories.AnyAsync(c => c.CatName == catName);
        }

        public async Task<CategoryDTO> GetCategoryByIdAsync(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryID == id);
            if (category == null)
            {
                throw new KeyNotFoundException("Không tìm thấy danh mục.");
            }

            return new CategoryDTO
            {
                CategoryID = category.CategoryID,
                CatName = category.CatName,
                CatOrder = category.CatOrder
            };
        }

        public async Task<CategoryDTO> UpdateCategoryAsync(int id, CategoryDTO dto)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryID == id);
            if (category == null)
            {
                throw new KeyNotFoundException("Không tìm thấy danh mục.");
            }

            if (!string.IsNullOrWhiteSpace(dto.CatName))
            {
                category.CatName = dto.CatName;
            }
            if (dto.CatOrder != default)
            {
                category.CatOrder = dto.CatOrder;
            }

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            return new CategoryDTO
            {
                CategoryID = category.CategoryID,
                CatName = category.CatName,
                CatOrder = category.CatOrder
            };
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryID == id);
            if (category == null)
            {
                return false;
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
