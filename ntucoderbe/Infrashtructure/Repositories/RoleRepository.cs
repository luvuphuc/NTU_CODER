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
        public async Task<RoleDTO> CreateRoleAsync(RoleDTO RoleDTO)
        {
            Role role = new Role
            {
                Name = RoleDTO.Name,
            };

            _context.Add(role);
            await _context.SaveChangesAsync();
            return RoleDTO;
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var compiler = await _context.Roles.FindAsync(id);
            if (compiler == null) return false;

            _context.Roles.Remove(compiler);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<RoleDTO?> GetRoleByIdAsync(int id)
        {
            RoleDTO? role = await _context.Roles
                .AsNoTracking()
                .Where(c => c.RoleID == id)
                .Select(c => new RoleDTO
                {
                    RoleID = c.RoleID,
                    Name = c.Name
                })
                .FirstOrDefaultAsync();

            return role;
        }


        public async Task<RoleDTO?> UpdateRoleAsync(int id, RoleDTO roleDTO)
        {
            var existing = await _context.Roles.FindAsync(id);
            if (existing == null) return null;
            if (!string.IsNullOrEmpty(roleDTO.Name))
                existing.Name = roleDTO.Name;

            _context.Update(existing);
            await _context.SaveChangesAsync();
            return roleDTO;
        }
    }
}
