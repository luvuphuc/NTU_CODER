using System.Collections.Concurrent;
using System.Diagnostics;

namespace ntucoderbe.Infrashtructure.Services
{
    public class SubmissionExecutionQueueService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ConcurrentQueue<int> _queue = new();
        private readonly SemaphoreSlim _concurrencyLimiter = new(10);

        public SubmissionExecutionQueueService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public void Enqueue(int submissionId)
        {
            _queue.Enqueue(submissionId);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_queue.TryDequeue(out int submissionId))
                {
                    await _concurrencyLimiter.WaitAsync(stoppingToken);

                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            using var scope = _serviceProvider.CreateScope();
                            var codeExecutionService = scope.ServiceProvider.GetRequiredService<CodeExecutionService>();
                            await codeExecutionService.ExecuteSubmissionAsync(submissionId);
                        }
                        catch (Exception ex)
                        {
                            Debug.WriteLine($"Lỗi xử lý submission {submissionId}: {ex.Message}");
                        }
                        finally
                        {
                            _concurrencyLimiter.Release();
                        }
                    });
                }
                else
                {
                    await Task.Delay(200, stoppingToken);
                }
            }
        }
    }
}
