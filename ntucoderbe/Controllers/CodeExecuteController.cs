using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.Infrashtructure.Services;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeExecuteController : ControllerBase
    {
        public readonly CodeExecutionService _codeExecutionService;

        public CodeExecuteController(CodeExecutionService codeExecutionService)
        {
            _codeExecutionService = codeExecutionService;
        }

        [HttpPost("{submissionId}")]
        public async Task<IActionResult> ExecuteCode(int submissionId)
        {
            try
            {
                var testRunResults = await _codeExecutionService.ExecuteSubmissionAsync(submissionId);

                if (testRunResults == null || !testRunResults.Any())
                {
                    return BadRequest(new { message = "Không có test case nào để chạy." });
                }

                return Ok(testRunResults);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }
        [HttpPost("multi-sub")]
        public async Task<IActionResult> ExecuteMultipleCodes([FromBody] List<int> submissionIds)
        {
            try
            {
                if (submissionIds == null || !submissionIds.Any())
                {
                    return BadRequest(new { message = "Danh sách submissions không hợp lệ." });
                }

                var testRunResults = await _codeExecutionService.ExecuteSubmissionsAsync(submissionIds);

                return Ok(testRunResults);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }


    }
}
