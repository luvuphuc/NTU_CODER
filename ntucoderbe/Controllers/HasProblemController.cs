using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HasProblemController : ControllerBase
    {
        private readonly HasProblemRepository _repository;
        public HasProblemController(HasProblemRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllHasProblem([FromQuery] QueryObject query, int contestId, string? sortField = null, bool ascending = true)
        {
            var all = await _repository.GetAllHasProblemByContestIdAsync(contestId, query, sortField, ascending);
            return Ok(all);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateHasProblem([FromBody] HasProblemDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var created = await _repository.CreateHasProblemAsync(dto);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHasProblemById(int id)
        {
            try
            {
                var detail = await _repository.GetHasProblemByIdAsync(id);
                return Ok(detail);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHasProblem(int id, [FromBody] HasProblemDTO dto)
        {
            try
            {
                var updated = await _repository.UpdateHasProblemAsync(id, dto);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpGet("count")]
        public async Task<IActionResult> GetHasProblemCount(int contestId)
        {
            var count = await _repository.GetTotalHasProblemByContestIdAsync(contestId);
            return Ok(new { count = count });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHasProblem(int id)
        {
            try
            {
                var isDeleted = await _repository.DeleteHasProblemAsync(id);

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
