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
        public async Task<IActionResult> TryRunCode([FromBody] string sourceCode, string compilerExtension, int problemId)
        {
            List<TestCase> testcases = await _testCaseRepository.GetAllTestCaseByProblemId(problemId);

            if (testcases == null || testcases.Count == 0)
            {
                return BadRequest(new
                {
                    Error = "Không tìm thấy test case cho bài toán này."
                });
            }

            foreach (var testcase in testcases)
            {
                string input = testcase.Input;
                string expectedOutput = testcase.Output;

                try
                {
                    var result = await _codeExecutionService.TryRunCodeAsync(
                        sourceCode,
                        compilerExtension,
                        input,
                        expectedOutput
                    );
                    if (result.Result != "Accepted")
                    {
                        return Ok(new
                        {
                            Result = result.Result,
                            Output = result.Output,
                            Error = result.Error,
                            TimeDuration = result.TimeDuration,
                            FailedTestCase = new
                            {
                                Input = input,
                                ExpectedOutput = expectedOutput
                            }
                        });
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(new
                    {
                        Error = ex.Message
                    });
                }
            }
            return Ok(new
            {
                Result = "Accepted"
            });
        }

    }
}
