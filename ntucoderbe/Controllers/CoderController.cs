using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Services;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoderController : ControllerBase
    {
        private readonly ICoderService _coderService;

        public CoderController(ICoderService coderService)
        {
            _coderService = coderService;
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllCoders([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _coderService.GetAllCoderAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,ex.Message);
            }
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateCoder([FromBody] CreateCoderDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _coderService.CreateCoderAsync(dto);
                return CreatedAtAction(nameof(CreateCoder), new { id = result.CoderID }, result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { Errors = ex.Errors.Select(e => e.ErrorMessage).ToList() });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCoderById(int id)
        {
            try
            {
                var coder = await _coderService.GetCoderByIdAsync(id);

                if (coder == null)
                {
                    return NotFound(new { Message = "Không tìm thấy coder với ID được cung cấp." });
                }

                return Ok(coder);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCoder(int id, [FromBody] CreateCoderDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _coderService.UpdateCoderAsync(id, dto);
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

    }
}
