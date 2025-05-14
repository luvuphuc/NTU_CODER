using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Helpers;
using ntucoderbe.Infrashtructure.Services;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class AnnouncementRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailHelper _emailHelper;

        public AnnouncementRepository(ApplicationDbContext context, EmailHelper emailHelper)
        {
            _context = context;
            _emailHelper = emailHelper;
        }

        public async Task<PagedResponse<AnnouncementDTO>> GetAllAnnouncementsAsync(
           QueryObject query,
           string? sortField = null,
           bool ascending = true)
        {
            var objQuery = _context.Announcements
                .Include(a => a.Contest)
                .Select(a => new AnnouncementDTO
                {
                    AnnouncementID = a.AnnouncementID,
                    AnnounceContent = a.AnnounceContent,
                    ContestID = a.ContestID,
                    ContestName = a.Contest.ContestName,
                    AnnouncementTime = a.AnnounceTime,
                    IsSent = a.IsSent,
                });
            objQuery = ApplySorting(objQuery, sortField, ascending);

            var obj = await PagedResponse<AnnouncementDTO>.CreateAsync(
                objQuery,
                query.Page,
                query.PageSize);
            return obj;
        }

        public IQueryable<AnnouncementDTO> ApplySorting(IQueryable<AnnouncementDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "announcetime" => ascending ? query.OrderBy(a => a.AnnouncementTime) : query.OrderByDescending(a => a.AnnouncementTime),
                _ => query.OrderBy(a => a.AnnouncementID)
            };
        }

        public async Task<AnnouncementDTO> CreateAnnouncementAsync(AnnouncementDTO dto)
        {
            if (dto.ContestID == null) {
                throw new InvalidOperationException("Chưa thêm cuộc thi vào thông báo");
            }
            Announcement obj = new Announcement
            {
                AnnounceContent = dto.AnnounceContent ?? "",
                ContestID = dto.ContestID.Value,
                AnnounceTime = dto.AnnouncementTime,
                IsSent = 0
            };

            _context.Announcements.Add(obj);
            await _context.SaveChangesAsync();
            return dto;
        }
        public async Task<bool> DeleteAnnouncementAsync(int id)
        {
            var obj = await _context.Announcements.FirstOrDefaultAsync(o => o.AnnouncementID == id);
            if (obj == null)
            {
                return false;
            }
            _context.Announcements.Remove(obj);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<AnnouncementDTO> GetAnnouncementByIdAsync(int id)
        {
            var obj = await _context.Announcements
                .Include(o => o.Contest)
                .FirstOrDefaultAsync(o => o.AnnouncementID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy");
            }

            return new AnnouncementDTO
            {
                AnnouncementID = obj.AnnouncementID,
                AnnounceContent = obj.AnnounceContent,
                ContestID = obj.ContestID,
                ContestName = obj.Contest.ContestName,
                AnnouncementTime = obj.AnnounceTime,
            };
        }
        public async Task<AnnouncementDTO> UpdateAnnouncementAsync(int id,AnnouncementDTO dto)
        {
            Announcement obj = await _context.Announcements.Include(a=>a.Contest).FirstOrDefaultAsync(obj => obj.AnnouncementID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy Announcement.");
            }
            if (dto.ContestID.HasValue)
            {
                obj.ContestID = dto.ContestID.Value;
            }
            obj.AnnounceContent = string.IsNullOrEmpty(dto.AnnounceContent) ? obj.AnnounceContent : dto.AnnounceContent;
            obj.AnnounceTime = dto.AnnouncementTime != default(DateTime)
                ? dto.AnnouncementTime.ToUniversalTime()
                : obj.AnnounceTime;
            await _context.SaveChangesAsync();

            return new AnnouncementDTO
            {
                AnnouncementID = obj.AnnouncementID,
                AnnounceContent = obj.AnnounceContent,
                ContestID = obj.ContestID,
                ContestName =obj.Contest.ContestName,
                AnnouncementTime = obj.AnnounceTime,    
            };
        }
        public async Task SendPendingAnnouncementsAsync()
        {
            DateTime now = DateTime.UtcNow;

            var pendingAnnouncements = await _context.Announcements
                .Where(a => a.AnnounceTime <= now && a.IsSent == 0)
                .Include(a => a.Contest)
                    .ThenInclude(c => c.Participations)
                        .ThenInclude(p => p.Coder)
                .ToListAsync();

            foreach (var announcement in pendingAnnouncements)
            {
                foreach (var participation in announcement.Contest.Participations)
                {
                    Coder coder = participation.Coder;
                    if (!string.IsNullOrEmpty(coder.CoderEmail))
                    {
                        string subject = $"[NTUCoder] Thông báo từ cuộc thi \"{announcement.Contest.ContestName}\"";
                        string body = $@"
                    <h3>Chào {coder.CoderName},</h3>
                    <p>{announcement.AnnounceContent}</p>
                    <br />
                    <p><i>NTUCoder Team</i></p>";

                        await _emailHelper.SendEmailAsync(coder.CoderEmail, subject, body);
                    }
                }

                announcement.IsSent = 1;
            }

            await _context.SaveChangesAsync();
        }
        public async Task<bool> SendAnnouncementNowAsync(int announcementId)
        {
            Announcement announcement = await _context.Announcements
                .Include(a => a.Contest)
                    .ThenInclude(c => c.Participations)
                        .ThenInclude(p => p.Coder)
                .FirstOrDefaultAsync(a => a.AnnouncementID == announcementId);

            if (announcement == null)
            {
                return false;
            }

            foreach (var participation in announcement.Contest.Participations)
            {
                var coder = participation.Coder;
                if (string.IsNullOrEmpty(coder.CoderEmail))
                    continue;

                var subject = $"[NTUCoder] Thông báo từ cuộc thi \"{announcement.Contest.ContestName}\"";
                var body = $@"
            <h3>Chào {coder.CoderName},</h3>
            <p>{announcement.AnnounceContent}</p>
            <br />
            <p><i>NTUCoder Team</i></p>";
                await _emailHelper.SendEmailAsync(coder.CoderEmail, subject, body);
            }

            announcement.IsSent = 1;
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
