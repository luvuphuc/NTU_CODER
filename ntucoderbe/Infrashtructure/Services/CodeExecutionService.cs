using Microsoft.EntityFrameworkCore;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using System.Diagnostics;

namespace ntucoderbe.Infrashtructure.Services
{
    public class CodeExecutionService
    {
        private readonly ApplicationDbContext _context;
        private const string dockerImage = "gcc:12";
        public CodeExecutionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TestRun>> ExecuteSubmissionAsync(int submissionId)
        {
            var submission = await _context.Submissions
                .Include(s => s.Problem)
                .FirstOrDefaultAsync(s => s.SubmissionID == submissionId)
                ?? throw new Exception($"Submission ID {submissionId} không tồn tại.");

            var testCases = await _context.TestCases
                .Where(tc => tc.ProblemID == submission.ProblemID)
                .ToListAsync();

            var testRuns = new List<TestRun>();
            foreach (var testCase in testCases)
                testRuns.Add(await ExecuteTestCase(submission, testCase));

            await _context.TestRuns.AddRangeAsync(testRuns);
            await _context.SaveChangesAsync();

            return testRuns;
        }

        private async Task<TestRun> ExecuteTestCase(Submission submission, TestCase testCase)
        {
            string tempFilePath = Path.Combine(Path.GetTempPath(), $"code_{Guid.NewGuid()}.c");
            string input = testCase.Input;
            await File.WriteAllTextAsync(tempFilePath, submission.SubmissionCode);

            string dockerCommand = $"docker run --rm -v \"{tempFilePath}:/code.c\" {dockerImage} sh -c \"gcc /code.c -o /code.out && echo '{input}' | /code.out\"";
            var stopwatch = Stopwatch.StartNew();
            var result = await RunProcessAsync(dockerCommand, testCase.Input);
            stopwatch.Stop();
            File.Delete(tempFilePath); 

            return new TestRun
            {
                SubmissionID = submission.SubmissionID,
                TestCaseID = testCase.TestCaseID,
                TimeDuration = (int)stopwatch.ElapsedMilliseconds,
                MemorySize = 0,
                TestOutput = result.Output,
                Result = result.IsSuccess ? (result.Output.Trim() == testCase.Output.Trim() ? "Accepted" : "Wrong Answer") : "Compilation Error",
                CheckerLog = result.Error
            };
        }

        private async Task<(bool IsSuccess, string Output, string Error)> RunProcessAsync(string command, string input)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/c echo {input} | {command}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = new Process { StartInfo = psi };
            process.Start();

            string output = await process.StandardOutput.ReadToEndAsync();
            string error = await process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();

            return (string.IsNullOrEmpty(error), output.Trim(), error);
        }
    }
}
