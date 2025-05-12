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
    public class CommentController : ControllerBase
    {
        private readonly CommentRepository _repository;
        private readonly AuthService _authService;

        public CommentController(CommentRepository blogRepository, AuthService authService)
        {
            _repository = blogRepository;
            _authService = authService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllComments([FromQuery] QueryObject query, string? sortField = null, bool ascending = true, int? blogID = null)
        {
            var obj = await _repository.GetAllCommentsAsync(query, sortField,ascending, blogID);
            return Ok(obj);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateComment([FromBody] CommentDTO dto)
        {

            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                dto.CoderID = _authService.GetUserIdFromToken();
                if (dto.CoderID == -1)
                {
                    return Unauthorized();
                }
                var created = await _repository.CreateCommentAsync(dto);
                return CreatedAtAction(nameof(GetCommentById), new { id = created.CommentID }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentById(int id)
        {
            try
            {
                var obj = await _repository.GetCommentByIdAsync(id);
                return Ok(obj);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] CommentDTO dto)
        {
            try
            {
                var updatedobj = await _repository.UpdateCommentAsync(id, dto);
                return Ok(updatedobj);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                var isDeleted = await _repository.DeleteCommentAsync(id);

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
    }
}
