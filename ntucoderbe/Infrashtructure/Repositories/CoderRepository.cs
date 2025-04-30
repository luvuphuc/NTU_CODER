using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Helpers;
using ntucoderbe.Infrastructure.Services;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using System;
using System.Security.Cryptography;
using System.Text;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class CoderRepository
    {
        private readonly ApplicationDbContext _context;

        public CoderRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var coderQuery = _context.Accounts
                .Include(a => a.Coder)
                .Select(a => new CoderDTO
                {
                    CoderID = a.Coder.CoderID,
                    UserName = a.UserName,
                    CoderName = a.Coder.CoderName,
                    CoderEmail = a.Coder.CoderEmail,
                    PhoneNumber = a.Coder.PhoneNumber,
                });
            coderQuery = ApplySorting(coderQuery, sortField, ascending);
            var coder = await PagedResponse<CoderDTO>.CreateAsync(
                coderQuery,
                query.Page,
                query.PageSize);
            return coder;
        }
        public IQueryable<CoderDTO> ApplySorting(IQueryable<CoderDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "codername" => ascending ? query.OrderBy(a => a.UserName) : query.OrderByDescending(a => a.UserName),
                _ => query.OrderBy(a => a.CoderID)
            };
        }
        public static string HashPassword(string password, string salt)
        {
            var combined = password + salt;
            using (var sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(combined));
                return Convert.ToBase64String(hashedBytes);
            }
        }
        public async Task<CreateCoderDTO> CreateCoderAsync(CreateCoderDTO dto)
        {
            if (await CheckEmailExist(dto.CoderEmail!))
            {
                throw new InvalidOperationException("Email đã tồn tại.");
            }

            if (await CheckUserExist(dto.UserName!))
            {
                throw new InvalidOperationException("Tên đăng nhập đã tồn tại.");
            }
            var salt = PasswordHelper.GenerateSalt();
            var hashedPassword = HashPassword(dto.Password!,salt);
            var account = new Account
            {
                UserName = dto.UserName!,
                Password = hashedPassword,
                SaltMD5 = salt,
                RoleID = dto.Role,
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            var coder = new Coder
            {
                CoderID = account.AccountID,
                CoderName = dto.CoderName!,
                CoderEmail = dto.CoderEmail!,
                PhoneNumber = dto.PhoneNumber,
                Gender = Enums.GenderEnum.Other,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "admin",
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "admin",
            };

            _context.Coders.Add(coder);
            await _context.SaveChangesAsync();
            dto.CoderID = coder.CoderID;
            return dto;
        }

        public async Task<bool> DeleteCoderAsync(int id)
        {
            var coder = await _context.Coders
                .Include(c => c.Account)
                .FirstOrDefaultAsync(c => c.CoderID == id);
            if (coder == null)
            {
                return false;
            }
            if (!string.IsNullOrEmpty(coder.Avatar))
            {
                var firebaseStorageService = new FirebaseStorageService();
                await firebaseStorageService.DeleteImageAsync(coder.Avatar);
            }
            _context.Coders.Remove(coder);
            if (coder.Account != null)
            {
                _context.Accounts.Remove(coder.Account);
            }
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CoderDetailDTO> GetCoderByIdAsync(int id)
        {
            var coder = await _context.Coders
                        .Include(c => c.Account)
                        .FirstOrDefaultAsync(c => c.CoderID == id);
            if (coder == null)
            {
                throw new KeyNotFoundException("Không tìm thấy");
            }

            return new CoderDetailDTO
            {
                CoderID = coder.CoderID,
                UserName = coder.Account.UserName,
                CoderName = coder.CoderName,
                CoderEmail = coder.CoderEmail,
                PhoneNumber = coder.PhoneNumber,
                Avatar = coder.Avatar,
                Description = coder.Description,
                Gender = coder.Gender,
                CreatedAt = coder.CreatedAt,
                CreatedBy = coder.CreatedBy,
                UpdatedAt = coder.UpdatedAt,
                UpdatedBy = coder.UpdatedBy,
                RoleID = coder.Account.RoleID,
            };
        }

        public async Task<CoderDetailDTO> UpdateCoderAsync(int id, CoderDetailDTO dto)
        {

            var existing = await _context.Coders.FindAsync(id);
            if (existing == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }
            if (dto.CoderName != null)
            {
                existing.CoderName = dto.CoderName;
            }
            if (dto.AvatarFile != null)
            {
                var firebaseStorageService = new FirebaseStorageService();
                var avatarFileName = "avatars/" + existing.CoderID + ".jpg";
                var avatarUrl = await firebaseStorageService.UploadImageAsync(avatarFileName, dto.AvatarFile.OpenReadStream());
                existing.Avatar = avatarUrl;
            }
            if (dto.Description != null)
            {
                existing.Description = dto.Description;
            }
            if (dto.Gender.HasValue)
            {
                existing.Gender = dto.Gender.Value;
            }
            if (dto.PhoneNumber != null)
            {
                existing.PhoneNumber = dto.PhoneNumber;
            }

            existing.UpdatedAt = DateTime.UtcNow;
            existing.UpdatedBy = "admin";

            _context.Coders.Update(existing);
            await _context.SaveChangesAsync();

            return new CoderDetailDTO
            {
                CoderID = existing.CoderID,
                CoderName = existing.CoderName,
                Avatar = existing.Avatar,
                Description = existing.Description,
                Gender = existing.Gender,
                PhoneNumber = existing.PhoneNumber,
                UpdatedAt = existing.UpdatedAt,
                UpdatedBy = existing.UpdatedBy
            };
        }
        public async Task<bool> CheckEmailExist(string email)
        {
            return await _context.Coders.AnyAsync(c => c.CoderEmail == email);
        }
        public async Task<bool> CheckUserExist(string username)
        {
            return await _context.Accounts.AnyAsync(c => c.UserName == username);
        }

        public async Task<CoderWithLanguageDTO> GetInformationForCoderAsync(int coderID)
        {
            List<Submission> submissions = await _context.Submissions
                .Where(s => s.TestResult == "Accepted" && s.CoderID == coderID)
                .ToListAsync();
            List<Compiler> compilers = await _context.Compilers.ToListAsync();

            List<LanguageDTO> languageLst = submissions
                .GroupBy(s => s.CompilerID)
                .Select(g => new LanguageDTO
                {
                    CompilerName = compilers.FirstOrDefault(c => c.CompilerID == g.Key)?.CompilerName ?? "Unknown",
                    SolvedCount = g.Select(s => s.ProblemID).Distinct().Count()
                })
                .ToList();

            int countProblemSolved = submissions
                .Select(s => s.ProblemID)
                .Distinct()
                .Count();

            int countFavourites = submissions
                .GroupBy(s => s.ProblemID)
                .Count();

            Coder coder = await _context.Coders.Where(c=>c.CoderID == coderID).FirstOrDefaultAsync();

            if (coder == null) return null;


            return new CoderWithLanguageDTO
            {
                CoderID = coder.CoderID,
                CoderName = coder.CoderName,
                CountProblemSolved = countProblemSolved,
                CountFavourites = countFavourites,
                Languages = languageLst,
                Avatar = coder.Avatar,
                Description = coder.Description,
            };
          
        }

    }
}
