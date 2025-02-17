using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public interface IBlogRepository
    {
        Task<PagedResponse<BlogDTO>> GetAllBlogsAsync(QueryObject query, string? sortField = null, bool ascending = true);
        Task<BlogDTO> CreateBlogAsync(BlogDTO dto);
        Task<BlogDTO> GetBlogByIdAsync(int id);
        Task<BlogDTO> UpdateBlogAsync(int id, BlogDTO dto);
        Task<bool> DeleteBlogAsync(int id);
    }
}
