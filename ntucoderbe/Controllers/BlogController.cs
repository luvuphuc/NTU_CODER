using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using System.ComponentModel.DataAnnotations;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly BlogRepository _blogRepository;

        public BlogController(BlogRepository blogRepository)
        {
            _blogRepository = blogRepository;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllBlogs([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            var categories = await _blogRepository.GetAllBlogsAsync(query, sortField, ascending);
            return Ok(categories);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateBlog([FromBody] BlogDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var created = await _blogRepository.CreateBlogAsync(dto);
                return CreatedAtAction(nameof(GetBlogById), new { id = created.BlogID }, created);
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
                var category = await _blogRepository.GetBlogByIdAsync(id);
                return Ok(category);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromBody] BlogDTO dto)
        {
            try
            {
                var updatedCategory = await _blogRepository.UpdateBlogAsync(id, dto);
                return Ok(updatedCategory);
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
                var isDeleted = await _blogRepository.DeleteBlogAsync(id);

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
