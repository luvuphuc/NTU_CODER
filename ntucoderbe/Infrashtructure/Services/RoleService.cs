using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;

namespace ntucoderbe.Infrashtructure.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<List<RoleDTO>> GetRoleAllAsync()
        {
            return await _roleRepository.GetRoleAllAsync();
        }
    }
}
