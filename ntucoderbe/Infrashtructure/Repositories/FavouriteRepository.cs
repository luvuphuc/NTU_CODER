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
        public async Task<bool> IsFavouriteExistAsync(int coderID, int problemID)
        {
            return await _context.Favourites.AnyAsync(f => f.ProblemID == problemID && f.CoderID == coderID);
        }

        public async Task<List<FavouriteDTO>> GetFavouriteByCoderIdAsync(int id)
        {
            var favourites = await _context.Favourites
                .Include(f => f.Coder)
                .Include(f => f.Problem)
                .Where(f => f.CoderID == id)
                .ToListAsync();

            if (favourites == null || favourites.Count == 0)
            {
                throw new KeyNotFoundException("Không tìm thấy mục yêu thích nào.");
            }

            var result = favourites.Select(f => new FavouriteDTO
            {
                CoderID = f.CoderID,
                ProblemID = f.ProblemID,
                CoderName = f.Coder.CoderName,
                ProblemName = f.Problem.ProblemName,
                Note = f.Note,
            }).ToList();

            return result;
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
