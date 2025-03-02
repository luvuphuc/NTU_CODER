using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly SubmissionRepository _submissionRepository;

        public SubmissionController(SubmissionRepository submissionRepository)
        {
            _submissionRepository = submissionRepository;
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllSubmissions([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _submissionRepository.GetAllSubmissionsAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateSubmission([FromBody] SubmissionDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _submissionRepository.CreateSubmissionAsync(dto);
                return CreatedAtAction(nameof(GetSubmissionById), new { id = result.ProblemID }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }

        // Get problem by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubmissionById(int id)
        {
            try
            {
                var problem = await _submissionRepository.GetSubmissionByIdAsync(id);

                if (problem == null)
                {
                    return NotFound(new { Message = "Không tìm thấy vấn đề với ID được cung cấp." });
                }

                return Ok(problem);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProblem(int id, [FromBody] SubmissionDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _submissionRepository.UpdateSubmissionAsync(id, dto);
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

        // Delete a problem by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProblem(int id)
        {
            try
            {
                var isDeleted = await _submissionRepository.DeleteSubmissionAsync(id);

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
                    Message = "Có lỗi xảy ra.",
                    Error = ex.Message
                });
            }
        }
    }
}
