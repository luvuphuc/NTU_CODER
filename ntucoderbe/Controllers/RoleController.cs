using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;

namespace ntucoderbe.Controllers
{
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly RoleRepository _roleRepository;

        public RoleController(RoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        [HttpGet]
        [Route("api/role")]
        public async Task<IActionResult> GetAllRole()
        {
            var all = await _roleRepository.GetRoleAllAsync();
            return Ok(all);
        }
    }
}
