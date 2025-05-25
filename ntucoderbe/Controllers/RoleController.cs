using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRolesById(int id)
        {
            var role = await _roleRepository.GetRoleByIdAsync(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] RoleDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _roleRepository.CreateRoleAsync(dto);
                return CreatedAtAction(nameof(CreateRole), new { id = result.RoleID }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _roleRepository.UpdateRoleAsync(id, dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                var isDeleted = await _roleRepository.DeleteRoleAsync(id);

                if (isDeleted)
                {
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Error = ex.Message
                });
            }
        }
    }
}
