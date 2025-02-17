using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class RoleRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<RoleDTO>> GetRoleAllAsync()
        {
            var roles = await _context.Roles
                .AsNoTracking()
                .Select(r => new RoleDTO
                {
                    RoleID = r.RoleID,
                    Name = r.Name,
                })
                .ToListAsync();

            return roles;
        }
    }
}
