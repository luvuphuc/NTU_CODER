using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.Infrashtructure.Services;

namespace ntucoderbe.Controllers
{
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }
        [HttpGet]
        [Route("api/role")]
        public async Task<IActionResult> GetAllRole()
        {
            var all = await _roleService.GetRoleAllAsync();
            return Ok(all);
        }
    }
}
