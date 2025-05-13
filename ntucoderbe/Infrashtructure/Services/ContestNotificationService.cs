using Microsoft.EntityFrameworkCore;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using NuGet.Protocol.Core.Types;

namespace ntucoderbe.Infrashtructure.Services
{
    public class ContestNotificationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1);
        public ContestNotificationService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    ApplicationDbContext _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    EmailServices emailService = new EmailServices();
                    AnnouncementRepository repository = scope.ServiceProvider.GetRequiredService<AnnouncementRepository>();

                    DateTime now = DateTime.UtcNow;
                    DateTime fiveMinutesLater = now.AddMinutes(10);

                    List<Contest> contests = await _context.Contest
                        .Where(c => c.StartTime >= now && c.StartTime <= fiveMinutesLater && c.Status == 2)
                        .Include(c => c.Participations)
                            .ThenInclude(p => p.Coder)
                        .ToListAsync();

                    foreach (Contest contest in contests)
                    {
                        
                        contest.Status = 1; 

                        foreach (Participation participation in contest.Participations)
                        {
                            if (participation.IsReceive == 1) continue;
                            Coder coder = participation.Coder;
                            if (!string.IsNullOrEmpty(coder.CoderEmail))
                            {
                                DateTime localTime = TimeZoneInfo.ConvertTimeFromUtc(contest.StartTime, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
                                string subject = $"[NTUCoder] Cuộc thi \"{contest.ContestName}\" đã bắt đầu!";
                                string body = $@"
                                <h3>Chào {coder.CoderName},</h3>
                                <p>Bạn đã đăng ký tham gia cuộc thi <strong>{contest.ContestName}</strong>.</p>
                                <p>Cuộc thi đã bắt đầu lúc: {localTime:dd/MM/yyyy HH:mm}.</p>
                                <p>Chúc bạn thi thật tốt!</p>
                                <br />
                                <p><i>NTUCoder Team</i></p>";

                                await emailService.SendEmailAsync(coder.CoderEmail, subject, body);
                                participation.IsReceive = 1;
                            }
                        }
                    }
                    await repository.SendPendingAnnouncementsAsync();
                    await _context.SaveChangesAsync();
                }
               

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }
    }
}
