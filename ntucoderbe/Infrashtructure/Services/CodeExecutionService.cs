﻿using Microsoft.EntityFrameworkCore;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

namespace ntucoderbe.Infrashtructure.Services
{
    public class CodeExecutionService
    {
        private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;

        public CodeExecutionService(IDbContextFactory<ApplicationDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<List<TestRun>> ExecuteSubmissionAsync(int submissionId)
        {
            await using var _context = _contextFactory.CreateDbContext();
            var submission = await _context.Submissions
                .Include(s => s.Problem)
                .Include(s => s.Compiler)
                .FirstOrDefaultAsync(s => s.SubmissionID == submissionId)
                ?? throw new Exception($"Submission ID {submissionId} không tồn tại.");

            var testCases = await _context.TestCases
                .Where(tc => tc.ProblemID == submission.ProblemID)
                .ToListAsync();

            var testRunTasks = testCases.Select(testCase => ExecuteTestCase(submission, testCase));
            var testRuns = await Task.WhenAll(testRunTasks);
            await _context.SaveChangesAsync();
            var submissionRepo = new SubmissionRepository(_context);
            await submissionRepo.UpdateSubmissionAfterTestRunAsync(submissionId);
            return testRuns.ToList();
        }
        public async Task<List<TestRun>> ExecuteSubmissionsAsync(List<int> submissionIds)
        {
            var testRuns = new ConcurrentBag<TestRun>();
            var semaphore = new SemaphoreSlim(3);

            await Parallel.ForEachAsync(submissionIds, async (submissionId, _) =>
            {
                await semaphore.WaitAsync();
                try
                {
                    var results = await ExecuteSubmissionAsync(submissionId);
                    foreach (var result in results)
                    {
                        testRuns.Add(result);
                    }
                    await using var _context = _contextFactory.CreateDbContext();
                    var submissionRepo = new SubmissionRepository(_context);
                    await submissionRepo.UpdateSubmissionAfterTestRunAsync(submissionId);
                }
                finally
                {
                    semaphore.Release();
                }
            });

            return testRuns.ToList();
        }

        private async Task<TestRun> ExecuteTestCase(Submission submission, TestCase testCase)
        {
            await using var _context = _contextFactory.CreateDbContext();
            var existingTestRun = await _context.TestRuns
                .FirstOrDefaultAsync(tr => tr.SubmissionID == submission.SubmissionID && tr.TestCaseID == testCase.TestCaseID);
            int timeLimit = 5000;
            Problem problem = await _context.Problems.Where(p => p.ProblemID == submission.ProblemID).FirstOrDefaultAsync();
            if (problem != null)
            {
                timeLimit = (int)(problem.TimeLimit * 1000);
            }
            (string dockerCommand, string containerName) = GetDockerCommand(submission.Compiler, submission.SubmissionCode, testCase.Input);
           
            var stopwatch = Stopwatch.StartNew();

            //tuple multi value
            (bool isSuccess, string output, string error) result;
            try
            {
                result = await RunProcessAsync(dockerCommand,containerName,timeLimit);
            }
            finally
            {
               
            }
            stopwatch.Stop();
            string testResult;
            if (!result.isSuccess)
            {
                bool isRuntimeError = Regex.IsMatch(result.error, @"Exception in thread|Error:");
                testResult = isRuntimeError ? "Runtime Error" : "Compilation Error";
            }
            else
            {
                bool isCorrect = string.Equals(result.output.Trim(), testCase.Output.Trim(), StringComparison.OrdinalIgnoreCase);
                testResult = isCorrect ? "Accepted" : "Wrong Answer";
            }

            if (existingTestRun != null)
            {
                existingTestRun.TimeDuration = (int)stopwatch.ElapsedMilliseconds;
                existingTestRun.TestOutput = result.output.Trim();
                existingTestRun.Result = testResult;
                existingTestRun.CheckerLog = result.error.Trim();
                existingTestRun.MemorySize = 0; 
            }
            else
            {
                existingTestRun = new TestRun
                {
                    SubmissionID = submission.SubmissionID,
                    TestCaseID = testCase.TestCaseID,
                    TimeDuration = (int)stopwatch.ElapsedMilliseconds,
                    MemorySize = 0,
                    TestOutput = result.output.Trim(),
                    Result = testResult,
                    CheckerLog = result.error.Trim()
                };
                await _context.TestRuns.AddAsync(existingTestRun);
            }
            await _context.SaveChangesAsync();
            return existingTestRun;
        }

        private (string, string) GetDockerCommand(Compiler compiler, string sourceCode, string input)
        {
            string containerName = $"code_runner_{Guid.NewGuid()}".Replace("-", "");
            string dockerImage = compiler.CompilerExtension.ToLower() switch
            {
                ".cpp" => "gcc:12",
                ".java" => "openjdk:17-alpine",
                ".py" => "python:3.9.21-alpine",
                _ => throw new Exception($"Compiler {compiler.CompilerName} không được hỗ trợ.")
            };

            string encodedSource = Convert.ToBase64String(Encoding.UTF8.GetBytes(sourceCode));

            string command = compiler.CompilerExtension.ToLower() switch
            {
                ".cpp" => $"docker run --rm --name {containerName} {dockerImage} sh -c \"echo '{encodedSource}' | base64 -d | tee temp.cpp | g++ -x c++ - -o temp.out && echo '{input.Replace("\"", "\\\"")}' | ./temp.out\"",

                ".java" => $"docker run --rm --name {containerName} {dockerImage} sh -c \"echo '{encodedSource}' | base64 -d > Main.java && javac Main.java && echo '{input.Replace("\"", "\\\"")}' | java Main\"",

                ".py" => $"docker run --rm --name {containerName} {dockerImage} sh -c \"echo '{encodedSource}' | base64 -d > temp.py && echo '{input.Replace("\"", "\\\"")}' | python3 temp.py\"",


                _ => throw new Exception($"Compiler {compiler.CompilerName} không được hỗ trợ.")
            };

            return (command, containerName);
        }


        private async Task<(bool IsSuccess, string Output, string Error)> RunProcessAsync(string command, string containerName, int timeMs = 5000)
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
            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();
            var waitTask = process.WaitForExitAsync();

            if (await Task.WhenAny(waitTask, Task.Delay(timeMs)) == waitTask)
            {
                string output = await outputTask;
                string error = await errorTask;
                return (string.IsNullOrEmpty(error), output.Trim(), error);
            }
            else
            {
                try
                {
                    var killProcess = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = $"/c docker rm -f {containerName}",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };

                    using var kill = new Process { StartInfo = killProcess };
                    kill.Start();
                    await kill.WaitForExitAsync();
                    if (!process.HasExited)
                    {
                        process.Kill();
                    }
                }
                catch (Exception ex)
                {
                    return (false, string.Empty, $"Runtime Error: {ex.Message}");
                }

                return (false, string.Empty, "Runtime Error: Time Limit Exceeded");
            }
        }

        public async Task<(string Result, string Output, string Error, int TimeDuration)> TryRunCodeAsync(string sourceCode, string compilerExtension, string input, string expectedOutput = "")
        {
            string containerName = $"code_runner_{Guid.NewGuid()}".Replace("-", "");

            string dockerImage = compilerExtension.ToLower() switch
            {
                ".cpp" => "gcc:12",
                ".java" => "openjdk:17-alpine",
                ".py" => "python:3.9.21-alpine",
                _ => throw new Exception($"Compiler {compilerExtension} không được hỗ trợ.")
            };

            string encodedSource = Convert.ToBase64String(Encoding.UTF8.GetBytes(sourceCode));

            string command = compilerExtension.ToLower() switch
            {
                ".cpp" => $"docker run --rm --name {containerName} {dockerImage} sh -c \"echo '{encodedSource}' | base64 -d | tee temp.cpp | g++ -x c++ - -o temp.out && echo '{input.Replace("\"", "\\\"")}' | ./temp.out\"",
                ".java" => $"docker run --rm --name {containerName} {dockerImage} sh -c \"echo '{encodedSource}' | base64 -d > Main.java && javac Main.java && echo '{input.Replace("\"", "\\\"")}' | java Main\"",
                ".py" => $"docker run --rm --name {containerName} {dockerImage} sh -c \"echo '{encodedSource}' | base64 -d > temp.py && echo '{input.Replace("\"", "\\\"")}' | python3 temp.py\"",
                _ => throw new Exception($"Compiler {compilerExtension} không được hỗ trợ.")
            };

            var stopwatch = Stopwatch.StartNew();
            var result = await RunProcessAsync(command, containerName);
            stopwatch.Stop();

            string testResult;
            if (!result.IsSuccess)
            {
                bool isRuntimeError = Regex.IsMatch(result.Error, @"Exception in thread|Error:");
                testResult = isRuntimeError ? "Runtime Error" : "Compilation Error";
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(expectedOutput))
                {
                    bool isCorrect = string.Equals(result.Output.Trim(), expectedOutput.Trim(), StringComparison.OrdinalIgnoreCase);
                    testResult = isCorrect ? "Accepted" : "Wrong Answer";
                }
                else
                {
                    testResult = "Success";
                }
            }

            return (testResult, result.Output, result.Error, (int)stopwatch.ElapsedMilliseconds);
        }

    }
}