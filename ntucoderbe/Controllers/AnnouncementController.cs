using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly AnnouncementRepository _repository;
        private readonly AuthService _authService;

        public AnnouncementController(AnnouncementRepository repository, AuthService authService)
        {
            _repository = repository;
            _authService = authService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllBlogs([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            var obj = await _repository.GetAllAnnouncementsAsync(query, sortField, ascending);
            return Ok(obj);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateBlog([FromBody] AnnouncementDTO dto)
        {

            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var created = await _repository.CreateAnnouncementAsync(dto);
                return CreatedAtAction(nameof(GetBlogById), new { id = created.AnnouncementID }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            try
            {
                var obj = await _repository.GetAnnouncementByIdAsync(id);
                return Ok(obj);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromBody] AnnouncementDTO dto)
        {
            try
            {
                var updatedobj = await _repository.UpdateAnnouncementAsync(id, dto);
                return Ok(updatedobj);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            try
            {
                var isDeleted = await _repository.DeleteAnnouncementAsync(id);

                if (isDeleted)
                {
                    return Ok(new
                    {
                        Message = "Xóa thành công."
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        Message = "Không tìm thấy."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Có lỗi xảy ra.",
                    Error = ex.Message
                });
            }
        }
        [HttpPost("{id}/send-now")]
        public async Task<IActionResult> SendAnnouncementNow(int id)
        {
            try
            {
                var success = await _repository.SendAnnouncementNowAsync(id);
                if (!success)
                {
                    return NotFound(new { message = "Không tìm thấy thông báo." });
                }

                return Ok(new { message = "Gửi thông báo thành công." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Có lỗi xảy ra khi gửi thông báo.",
                    error = ex.Message
                });
            }
        }

    }
}
