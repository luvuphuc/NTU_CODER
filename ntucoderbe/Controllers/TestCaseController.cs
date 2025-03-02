using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestCaseController : ControllerBase
    {
        private readonly TestCaseRepository _repository;
        public TestCaseController(TestCaseRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTestCase([FromQuery] QueryObject query,int problemID, string? sortField = null, bool ascending = true)
        {
            var all = await _repository.GetAllTestCasesByProblemIdAsync(problemID,query, sortField, ascending);
            return Ok(all);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateTestCase([FromBody] TestCaseDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var created = await _repository.CreateTestCaseAsync(dto);
                return CreatedAtAction(nameof(GetTestCaseById), new { id = created.TestCaseID }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTestCaseById(int id)
        {
            try
            {
                var detail = await _repository.GetTestCaseByIdAsync(id);
                return Ok(detail);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTestCase(int id, [FromBody] TestCaseDTO dto)
        {
            try
            {
                var updated = await _repository.UpdateTestCaseAsync(id, dto);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpGet("count")]
        public async Task<IActionResult> GetTestCaseCount(int problemId)
        {
            var count = await _repository.GetTotalTestCasesByProblemIdAsync(problemId);
            return Ok(new { TotalTestCases = count });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTestCase(int id)
        {
            try
            {
                var isDeleted = await _repository.DeleteTestCaseAsync(id);

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
