﻿using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Services;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
                throw new InvalidOperationException("Tên blog đã tồn tại");
            }
            var blog = new Blog
            {
                Title = dto.Title!,
                Content = dto.Content!,
                BlogDate = DateTime.UtcNow,
                CoderID = (int)dto.CoderID!,
                PinHome = dto.PinHome ?? 0,
                Published = dto.Published ?? 1,
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return dto;
        }
        public async Task<bool> CheckTitleExist(string title)
        {
            return await _context.Blogs.AnyAsync(p => p.Title == title);
        }
        public async Task<bool> DeleteBlogAsync(int id)
        {
            var obj = await _context.Blogs.FirstOrDefaultAsync(o => o.BlogID == id);
            if (obj == null)
            {
                return false;
            }
            _context.Blogs.Remove(obj);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResponse<BlogDTO>> GetAllBlogsAsync(QueryObject query, string? sortField = null, bool ascending = true, bool published = false,bool pinHome = false)
        {
            IQueryable<BlogDTO> blogQuery = _context.Blogs
                .Include(p => p.Coder)
                .Include(p =>p.Comments)
                .Select(p => new BlogDTO
                {
                    BlogID = p.BlogID,
                        Title = p.Title,
                    BlogDate = p.BlogDate,
                    PinHome = p.PinHome,
                    Content = p.Content,
                    Published = p.Published,
                    CoderID = p.CoderID,
                    CoderName = p.Coder.CoderName,
                    CoderAvatar = p.Coder.Avatar,
                    CountComment = p.Comments.Count
                });
            if (published)
            {
                blogQuery = blogQuery.Where(b => b.Published == 1);
            }
            if (pinHome)
            {
                blogQuery = blogQuery.Where(b => b.PinHome == 1);
            }
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
                "blogdate" => ascending ? query.OrderBy(p=>p.BlogDate) : query.OrderByDescending(p=>p.BlogDate),
                _ => query.OrderByDescending(p => p.BlogID),
            };
        }
        public async Task<BlogDTO> GetBlogByIdAsync(int id)
        {
            var obj = await _context.Blogs
                .Include(o => o.Coder)
                .FirstOrDefaultAsync(o => o.BlogID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy");
            }

            return new BlogDTO
            {
                BlogID = obj.BlogID,
                Content = obj.Content,
                CoderID = obj.CoderID,
                Title = obj.Title,
                BlogDate = obj.BlogDate,
                PinHome = obj.PinHome,
                Published = obj.Published,
                CoderName = obj.Coder.CoderName
            };
        }
        public async Task<BlogDTO> UpdateBlogAsync(int id, BlogDTO dto)
        {
            var obj = await _context.Blogs
                .Include(s => s.Coder)
                .FirstOrDefaultAsync(o => o.BlogID == id);

            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }
            obj.Title = string.IsNullOrEmpty(dto.Title) ? obj.Title : dto.Title;
            obj.Content = string.IsNullOrEmpty(dto.Content) ? obj.Content : dto.Content;
            obj.Published = dto.Published ?? obj.Published;
            obj.PinHome = dto.PinHome ?? obj.PinHome;
            await _context.SaveChangesAsync();

            return new BlogDTO
            {
                BlogID = obj.BlogID,
                Title = obj.Title,
                BlogDate = obj.BlogDate,
                PinHome = obj.PinHome,
                Published = obj.Published,
                CoderName = obj.Coder.CoderName
            };
        }
        public async Task<List<BlogDTO>> GetAllBlogFromCoderIDAsync(int coderID)
        {
            var blogQuery = await _context.Blogs
                .Include(p => p.Coder)
                .Where(p => p.CoderID == coderID)
                .Select(p => new BlogDTO
                {
                    BlogID = p.BlogID,
                    Title = p.Title,
                    BlogDate = p.BlogDate,
                    PinHome = p.PinHome,
                    Published = p.Published,
                    CoderID = p.CoderID,
                    CoderName = p.Coder.CoderName
                }).ToListAsync();
                
            return blogQuery;

        }
    }
}
