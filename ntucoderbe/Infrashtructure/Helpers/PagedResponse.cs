using Microsoft.EntityFrameworkCore;

namespace AddressManagementSystem.Infrashtructure.Helpers
{
    public class PagedResponse<T>
    {
        public PagedResponse(List<T> list, int page, int pageSize, int totalCount, int totalPages) 
        {
            Data = list;
            CurrentPage = page;
            PageSize = pageSize;
            TotalCount = totalCount;
            TotalPages = totalPages;
        }

        public List<T> Data { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage => CurrentPage < TotalPages;
        public bool HasPreviousPage => CurrentPage > 1;
        public static async Task<PagedResponse<T>> CreateAsync(IQueryable<T> query, int page, int pageSize)
        {
            page = page < 1 ? 1 : page;
            pageSize = pageSize < 1 ? 1 : pageSize;
            var totalCount = await query.CountAsync();
            var totalPages = (int) Math.Ceiling((decimal)totalCount/ pageSize);
            
            var list = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new(list, page, pageSize, totalCount, totalPages);
        }
    }
}
