using Microsoft.EntityFrameworkCore;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace ntucoderbe.Infrashtructure.Services
{
    public class CodeExecutionService
    {
        private readonly ApplicationDbContext _context;

        public CodeExecutionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TestRun>> ExecuteSubmissionAsync(int submissionId)
        {
            var submission = await _context.Submissions
                .Include(s => s.Problem)
                .Include(s => s.Compiler)
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
            string tempFileName = submission.Compiler.CompilerName.ToLower() == "java"
                ? ExtractJavaClassName(submission.SubmissionCode)
                : $"code_{Guid.NewGuid()}";

            string tempFilePath = Path.Combine(Path.GetTempPath(), $"{tempFileName}{submission.Compiler.CompilerExtension}");
            await File.WriteAllTextAsync(tempFilePath, submission.SubmissionCode);

            string dockerCommand = GetDockerCommand(submission.Compiler, tempFileName, testCase.Input);
            var stopwatch = Stopwatch.StartNew();
            var result = await RunProcessAsync(dockerCommand);
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

        private string GetDockerCommand(Compiler compiler, string fileName, string input)
        {
            string volumeMount = $"-v \"{Path.GetTempPath()}:/source\"";
            string dockerImage = compiler.CompilerName.ToLower() switch
            {
                "gcc" or "g++" => "gcc:12",
                "java" => "openjdk:17-alpine",
                "python" => "python:3.9.21-alpine",
                _ => throw new Exception($"Compiler {compiler.CompilerName} không được hỗ trợ.")
            };

            string command = compiler.CompilerName.ToLower() switch
            {
                "gcc" => $"docker run --rm {volumeMount} {dockerImage} sh -c \"gcc /source/{fileName}{compiler.CompilerExtension} -o /source/{fileName}.out && echo '{input}' | /source/{fileName}.out\"",
                "java" => $"docker run --rm {volumeMount} {dockerImage} sh -c \"javac /source/{fileName}{compiler.CompilerExtension} && echo '{input}' | java -cp /source {fileName}\"",
                "python" => $"docker run --rm {volumeMount} {dockerImage} sh -c \"echo '{input}' | python3 /source/{fileName}{compiler.CompilerExtension}\"",
                _ => throw new Exception($"Compiler {compiler.CompilerName} không được hỗ trợ.")
            };
            return command;
        }

        private async Task<(bool IsSuccess, string Output, string Error)> RunProcessAsync(string command)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/c {command}",
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
        private string ExtractJavaClassName(string code)
        {
            var match = Regex.Match(code, @"public\s+class\s+(\w+)");
            return match.Success ? match.Groups[1].Value : "Main"; 
        }

    }
}
