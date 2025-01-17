using AddressManagementSystem.Infrashtructure.Helpers;
using ntucoderbe.DTOs;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public interface IRoleRepository
    {
        Task<List<RoleDTO>> GetRoleAllAsync();
    }
}