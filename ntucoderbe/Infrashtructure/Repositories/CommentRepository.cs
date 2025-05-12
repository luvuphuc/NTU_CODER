using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class CommentRepository
    {
        private readonly ApplicationDbContext _context;

        public CommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CommentDTO> CreateCommentAsync(CommentDTO dto)
        {
            Comment obj = new Comment
            {
                Content = dto.Content!,
                CommentTime = DateTime.UtcNow,
                CoderID = dto.CoderID ?? 0,
                BlogID = dto.BlogID?? 0,

            };

            _context.Comments.Add(obj);
            await _context.SaveChangesAsync();
            return dto;
        }
        public async Task<bool> DeleteCommentAsync(int id)
        {
            var obj = await _context.Comments.FirstOrDefaultAsync(o => o.CommentID == id);
            if (obj == null)
            {
                return false;
            }
            _context.Comments.Remove(obj);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResponse<CommentDTO>> GetAllCommentsAsync(QueryObject query, string? sortField = null, bool ascending = true, int? blogID = null)
        {
            IQueryable<CommentDTO> cmtQuery = _context.Comments
                .Include(p => p.Coder)
                .Include(p => p.Blog)
                .Select(p => new CommentDTO
                {
                    CommentID = p.CommentID,
                    CoderID = p.CoderID,
                    Content = p.Content,
                    BlogID = p.BlogID,
                    CoderName = p.Coder.CoderName,
                    BlogName = p.Blog.Title,
                    CommentTime = p.CommentTime,
                    CoderAvatar = p.Coder.Avatar,

                });
            if (blogID.HasValue)
            {
                cmtQuery = cmtQuery.Where(c=>c.BlogID == blogID.Value);
            }
            cmtQuery = ApplySorting(cmtQuery, sortField, ascending);
            PagedResponse<CommentDTO> cmt = await PagedResponse<CommentDTO>.CreateAsync(
                cmtQuery,
                query.Page,
                query.PageSize);
            return cmt;
        }
        public IQueryable<CommentDTO> ApplySorting(IQueryable<CommentDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "commenttime" => ascending ? query.OrderBy(p => p.CommentTime) : query.OrderByDescending(p => p.CommentTime),
                _ => query.OrderBy(p => p.CommentID),
            };
        }
        public async Task<CommentDTO> GetCommentByIdAsync(int id)
        {
            Comment obj = await _context.Comments
                .Include(o => o.Coder)
                .Include(o => o.Blog)
                .FirstOrDefaultAsync(o => o.CommentID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy");
            }

            return new CommentDTO
            {
                CommentID = obj.CommentID,
                CoderID = obj.CoderID,
                BlogID = obj.BlogID,
                CoderName = obj.Coder.CoderName,
                BlogName = obj.Blog.Title,
                CommentTime = obj.CommentTime,
                CoderAvatar = obj.Coder.Avatar,
            };
        }
        public async Task<CommentDTO> UpdateCommentAsync(int id, CommentDTO dto)
        {
            Comment obj = await _context.Comments
                .Include(s => s.Coder)
                .Include (s => s.Blog)
                .FirstOrDefaultAsync(o => o.CommentID == id);

            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }
            obj.Content = string.IsNullOrEmpty(dto.Content) ? obj.Content : dto.Content;
            obj.CommentTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new CommentDTO
            {
                CommentID = obj.CommentID,
                CoderID = obj.CoderID,
                BlogID = obj.BlogID,
                CoderName = obj.Coder.CoderName,
                BlogName = obj.Blog.Title,
                CommentTime = obj.CommentTime,
                CoderAvatar = obj.Coder.Avatar,
            };
        }
    }
}
