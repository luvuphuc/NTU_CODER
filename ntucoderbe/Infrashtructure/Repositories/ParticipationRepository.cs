using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using NuGet.Protocol.Core.Types;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class ParticipationRepository
    {
        private readonly ApplicationDbContext _context;

        public ParticipationRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResponse<ParticipationDTO>> GetAllParticipationsAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var objQuery = _context.Participations
                .Include(c => c.Contest)
                .Include(c=>c.Coder)
               .Select(c => new ParticipationDTO
               {
                   ParticipationID = c.ParticipationID,
                   ContestID = c.ContestID,
                   ContestName = c.Contest.ContestName,
                   CoderID = c.CoderID,
                   CoderName = c.Coder.CoderName,
                   Rank = c.Rank,
                   TimeScore = c.TimeScore,
                   PointScore  = c.PointScore,

               });
            objQuery = ApplySorting(objQuery, sortField, ascending);
            var obj = await PagedResponse<ParticipationDTO>.CreateAsync(
                objQuery,
                query.Page,
                query.PageSize);
            return obj;
        }

        public IQueryable<ParticipationDTO> ApplySorting(IQueryable<ParticipationDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "rank" => ascending ? query.OrderBy(a => a.Rank) : query.OrderByDescending(a => a.Rank),
                _ => query.OrderBy(a => a.ParticipationID)
            };
        }

        public async Task<ParticipationDTO> CreateParticipationAsync(ParticipationDTO dto)
        {
            Participation participation = await IsParticipationExistAsync(dto.CoderID, dto.ContestID);
            if (participation != null)
            {
                throw new InvalidOperationException("Đã đăng ký là thành viên.");
            }
            Participation par = new Participation
            {
                ContestID = dto.ContestID,
                CoderID = dto.CoderID,
                RegisterTime = dto.RegisterTime,
                PointScore = 0,
                TimeScore = 0,
                Rank = 0
            };

            _context.Participations.Add(par);
            await _context.SaveChangesAsync();
            return dto;
        }
        public async Task<Participation> IsParticipationExistAsync(int coderID, int contestID)
        {
            return await _context.Participations.FirstOrDefaultAsync(c => c.CoderID == coderID && c.ContestID ==contestID);
        }

        public async Task<ParticipationDTO> GetParticipationByIdAsync(int id)
        {
            Participation obj = await _context.Participations.FirstOrDefaultAsync(c => c.ParticipationID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy thể loại.");
            }

            return new ParticipationDTO
            {
                ParticipationID = obj.ParticipationID,
                ContestID = obj.ContestID,
                ContestName = obj.Contest.ContestName,
                CoderID = obj.CoderID,
                CoderName = obj.Coder.CoderName,
                Rank = obj.Rank,
                TimeScore = obj.TimeScore,
                PointScore = obj.PointScore,
            };
        }

        public async Task<ParticipationDTO> UpdateParticipationAsync(int id, ParticipationDTO dto)
        {
            var obj = await _context.Participations.FirstOrDefaultAsync(c => c.ParticipationID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy thể loại.");
            }

            obj.TimeScore = dto.TimeScore ?? obj.TimeScore;
            obj.PointScore = dto.PointScore ?? obj.PointScore;
            obj.Rank = dto.Rank ?? obj.Rank;

            _context.Participations.Update(obj);
            await _context.SaveChangesAsync();

            return new ParticipationDTO
            {
                ParticipationID = obj.ParticipationID,
                ContestID = obj.ContestID,
                ContestName = obj.Contest.ContestName,
                CoderID = obj.CoderID,
                CoderName = obj.Coder.CoderName,
                Rank = obj.Rank,
                TimeScore = obj.TimeScore,
                PointScore = obj.PointScore,
            };
        }

        public async Task<bool> DeleteParticipationAsync(int id)
        {
            var obj = await _context.Participations.FirstOrDefaultAsync(c => c.ParticipationID == id);
            if (obj == null)
            {
                return false;
            }
            _context.Participations.Remove(obj);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<(int participationId, bool onGoing)> CheckRegisteredAndPerAsync(int coderID, int contestId)
        {
            Participation participation = await IsParticipationExistAsync(coderID, contestId);
            int participationId = participation != null ? participation.ParticipationID : -1;

            bool onGoing = await _context.Contest
                .AnyAsync(c => c.ContestID == contestId && c.Status == 1);

            return (participationId, onGoing);
        }

    }
}
