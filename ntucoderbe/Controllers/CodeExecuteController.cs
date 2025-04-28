using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;
using ntucoderbe.Models.ERD;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeExecuteController : ControllerBase
    {
        public readonly CodeExecutionService _codeExecutionService;
        public readonly TestCaseRepository _testCaseRepository;

        public CodeExecuteController(CodeExecutionService codeExecutionService, TestCaseRepository testCaseRepository)
        {
            _codeExecutionService = codeExecutionService;
            _testCaseRepository = testCaseRepository;
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

        [HttpPost("try-run")]
        public async Task<IActionResult> TryRunCode([FromBody]string sourceCode,string compilerExtension, int problemId)
        {
            TestCaseDTO testcase = await _testCaseRepository.GetSampleTestByProblemIdAsync(problemId);
            if(testcase == null)
            {
                return BadRequest(new
                {
                    Error = "Không tìm thấy test case mẫu cho bài toán này."
                });
            }
            string input = testcase.Input;
            string expectedOutput = testcase.Output;    
            try
            {
                (string Result, string Output, string Error, int TimeDuration) result = await _codeExecutionService.TryRunCodeAsync(
                    sourceCode,
                    compilerExtension,
                    input,
                    expectedOutput
                );
                return Ok(new
                {
                    result.Result,
                    result.Output,
                    result.Error,
                    result.TimeDuration
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Error = ex.Message
                });
            }
        }


    }
}
