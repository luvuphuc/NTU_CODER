using ntucoderbe.DTOs;

namespace ntucoderbe.Infrashtructure.Services
{
    public interface IRoleService
    {
        Task<List<RoleDTO>> GetRoleAllAsync();
    }
}
