﻿using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;
using System.ComponentModel.DataAnnotations;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly BlogRepository _blogRepository;
        private readonly AuthService _authService;

        public BlogController(BlogRepository blogRepository, AuthService authService)
        {
            _blogRepository = blogRepository;
            _authService = authService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllBlogs([FromQuery] QueryObject query, string? sortField = null, bool ascending = true, bool published = false,bool pinHome = false)
        {
            var obj = await _blogRepository.GetAllBlogsAsync(query, sortField, ascending,published,pinHome);
            return Ok(obj);
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
                dto.CoderID = _authService.GetUserIdFromToken();
                if (dto.CoderID == -1) {
                    return Unauthorized();
                }
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
                var obj = await _blogRepository.GetBlogByIdAsync(id);
                return Ok(obj);
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
                var updatedobj = await _blogRepository.UpdateBlogAsync(id, dto);
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
