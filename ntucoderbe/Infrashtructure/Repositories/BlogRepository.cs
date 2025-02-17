using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class BlogRepository
    {
        private readonly ApplicationDbContext _context;

        public BlogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BlogDTO> CreateBlogAsync(BlogDTO dto) 
        {
            if (await CheckTitleExist(dto.Title!))
            {
                throw new ValidationException("Tên bài viết đã tồn tại");
            }
            var blog = new Blog
            {
                Title = dto.Title,
                Content = dto.Content,
                BlogDate = DateTime.UtcNow,
                PinHome = 0,
                Published = 0,
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return dto;
        }
        public async Task<bool> CheckTitleExist(string title)
        {
            return await _context.Blogs.AnyAsync(p => p.Title == title);
        }
        public Task<bool> DeleteBlogAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<PagedResponse<BlogDTO>> GetAllBlogsAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var blogQuery = _context.Blogs
                .Include(p => p.Coder)
                .Select(p => new BlogDTO
                {
                    BlogID = p.BlogID,
                    Title = p.Title,
                    BlogDate = p.BlogDate,
                    PinHome = p.PinHome,
                    Published = p.Published,
                    CoderName = p.Coder.CoderName
                });

            blogQuery = ApplySorting(blogQuery, sortField, ascending);
            var blogs = await PagedResponse<BlogDTO>.CreateAsync(
                blogQuery,
                query.Page,
                query.PageSize);
            return blogs;
        }
        public IQueryable<BlogDTO> ApplySorting(IQueryable<BlogDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "title" => ascending ? query.OrderBy(p => p.Title) : query.OrderByDescending(p => p.Title),
                _ => query.OrderBy(p => p.BlogID),
            };
        }
        public Task<BlogDTO> GetBlogByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<BlogDTO> UpdateBlogAsync(int id, BlogDTO dto)
        {
            throw new NotImplementedException();
        }
    }
}
