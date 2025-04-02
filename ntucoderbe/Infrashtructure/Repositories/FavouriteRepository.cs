using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class FavouriteRepository
    {
        private readonly ApplicationDbContext _context;

        public FavouriteRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResponse<FavouriteDTO>> GetAllFavouritesAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var objquery = _context.Favourites
                .Include(c=> c.Coder)
                .Include(c=>c.Problem)
               .Select(c => new FavouriteDTO
               {
                   CoderID = c.CoderID,
                   ProblemID = c.ProblemID,
                   CoderName = c.Coder.CoderName,
                   ProblemName = c.Problem.ProblemName,
                   Note = c.Note,
               });
            objquery = ApplySorting(objquery, sortField, ascending);
            var cat = await PagedResponse<FavouriteDTO>.CreateAsync(
                objquery,
                query.Page,
                query.PageSize);
            return cat;
        }

        public IQueryable<FavouriteDTO> ApplySorting(IQueryable<FavouriteDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "coderid" => ascending ? query.OrderBy(a => a.CoderID) : query.OrderByDescending(a => a.CoderID),
                "problemid" => ascending ? query.OrderBy(a => a.ProblemID) : query.OrderByDescending(a => a.ProblemID),
                _ => query.OrderBy(a => a.ProblemID)
            };
        }

        public async Task<FavouriteDTO> CreateFavouriteAsync(FavouriteDTO dto)
        {
            if (await IsFavouriteExistAsync(dto.ProblemID, dto.CoderID))
            {
                throw new InvalidOperationException("Mục yêu thích đã tồn tại.");
            }
            var obj = new Favourite
            {
                CoderID = dto.CoderID,
                ProblemID = dto.ProblemID,
                Note = dto.Note,
            };

            _context.Favourites.Add(obj);
            await _context.SaveChangesAsync();
            return dto;
        }
        private async Task<bool> IsFavouriteExistAsync(int problemID, int coderID)
        {
            return await _context.Favourites.AnyAsync(f => f.ProblemID == problemID && f.CoderID == coderID);
        }

        public async Task<FavouriteDTO> GetFavouriteByCoderIdAsync(int id)
        {
            var obj = await _context.Favourites
                            .Include(c=>c.Coder).
                            Include(c=>c.Problem).
                            FirstOrDefaultAsync(c => c.CoderID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }

            return new FavouriteDTO
            {
                CoderID = obj.CoderID,
                ProblemID = obj.ProblemID,
                CoderName = obj.Coder.CoderName,
                ProblemName = obj.Problem.ProblemName,
                Note = obj.Note,
            };
        }
        public async Task<bool> DeleteFavouriteAsync(int coderID, int problemID)
        {
            var obj = await _context.Favourites.FirstOrDefaultAsync(obj => obj.CoderID == coderID && obj.ProblemID == problemID);
            if (obj == null)
            {
                return false;
            }

            _context.Favourites.Remove(obj);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
