using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using Humanizer;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Enums;
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
        public async Task<CoderDTO> CreateCoderAsync(CoderDTO dto)
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
                RoleID = dto.RoleID ?? 2,
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
        public async Task<CoderDTO> GetCoderByIdAsync(int id)
        {
            var coder = await _context.Coders
                        .Include(c => c.Account)
                        .FirstOrDefaultAsync(c => c.CoderID == id);
            if (coder == null)
            {
                throw new KeyNotFoundException("Không tìm thấy");
            }

            return new CoderDTO
            {
                CoderID = coder.CoderID,
                UserName = coder.Account.UserName,
                CoderName = coder.CoderName,
                CoderEmail = coder.CoderEmail,
                PhoneNumber = coder.PhoneNumber,
                DateOfBirth = coder.DateOfBirth,
                Avatar = coder.Avatar,
                Description = coder.Description,
                Gender = coder.Gender.HasValue ? (int)coder.Gender.Value : -1,
                CreatedAt = coder.CreatedAt,
                CreatedBy = coder.CreatedBy,
                UpdatedAt = coder.UpdatedAt,
                UpdatedBy = coder.UpdatedBy,
                RoleID = coder.Account.RoleID
            };
        }
        public async Task<Account> GetAccountByCoderIdAsync(int coderId)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountID == coderId);

            if (account == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tài khoản.");
            }

            return account;
        }

        public async Task<CoderDTO> UpdateCoderAsync(int id, CoderDTO dto)
        {

            Coder existing = await _context.Coders.Include(c => c.Account).FirstOrDefaultAsync(c => c.CoderID == id);
            if (existing == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }
            if (dto.CoderName != null)
            {
                existing.CoderName = dto.CoderName;
            }
            if (dto.CoderEmail != null)
            {
                if (await CheckEmailExist(dto.CoderEmail!))
                {
                    throw new InvalidOperationException("Email đã tồn tại.");
                }
                existing.CoderEmail = dto.CoderEmail;
            }
            if (dto.DateOfBirth.HasValue)
            {
                existing.DateOfBirth = dto.DateOfBirth.Value;
            }
            if (dto.Description != null)
            {
                existing.Description = dto.Description;
            }
            if (dto.Gender.HasValue)
            {
                existing.Gender = (GenderEnum?)dto.Gender.Value;
            }
            if (dto.RoleID.HasValue && existing.Account.RoleID != dto.RoleID)
            {
                existing.Account.RoleID = dto.RoleID.Value;
            }

            if (dto.OldPassword != null && dto.Password != null)
            {
                bool isPwdValid = PasswordHelper.VerifyPassword(dto.OldPassword, existing.Account.Password, existing.Account.SaltMD5);
                if (!isPwdValid)
                {
                    throw new ValidationException("Mật khẩu cũ không chính xác.");
                }
                else
                {
                    string salt = PasswordHelper.GenerateSalt();
                    string hashedPassword = PasswordHelper.HashPassword(dto.Password, salt);
                    existing.Account.Password = hashedPassword;
                    existing.Account.SaltMD5 = salt;
                }
                
            }
            if (dto.PhoneNumber != null)
            {
                existing.PhoneNumber = dto.PhoneNumber;
            }

            existing.UpdatedAt = DateTime.UtcNow;
            existing.UpdatedBy = "admin";

            _context.Coders.Update(existing);
            await _context.SaveChangesAsync();

            return new CoderDTO
            {
                CoderID = existing.CoderID,
                CoderName = existing.CoderName,
                Avatar = existing.Avatar,
                Description = existing.Description,
                DateOfBirth = existing.DateOfBirth,
                Gender = (int)(existing.Gender),
                PhoneNumber = existing.PhoneNumber,
                UpdatedAt = existing.UpdatedAt,
                UpdatedBy = existing.UpdatedBy,
                RoleID = existing.Account.RoleID,
            };
        }
        public async Task<bool> CheckEmailExist(string email)
        {
            return await _context.Coders.AnyAsync(c => c.CoderEmail == email);
        }
        public async Task<CoderDTO> GetCoderByEmailAsync(string email)
        {
            Coder existing = await _context.Coders.Include(c=>c.Account).Where(c => c.CoderEmail == email).FirstOrDefaultAsync();
            if (existing != null)
            {
                return new CoderDTO
                {
                    CoderID = existing.CoderID,
                    CoderName = existing.CoderName,
                    Avatar = existing.Avatar,
                    Description = existing.Description,
                    DateOfBirth = existing.DateOfBirth,
                    Gender = (int)(existing.Gender),
                    PhoneNumber = existing.PhoneNumber,
                    UpdatedAt = existing.UpdatedAt,
                    UpdatedBy = existing.UpdatedBy,
                    RoleID = existing.Account.RoleID,
                };
            }
            return null;
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

            int countFavourites = await _context.Favourites.CountAsync(c => c.CoderID == coderID);

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
        public async Task<string> UpdateAvatarAsync(int coderId, AvatarUploadDTO dto)
        {
            Coder coder = await _context.Coders.FirstOrDefaultAsync(c=>c.CoderID == coderId);
            if(coder == null)
            {
                throw new Exception("Không tìm thấy coder");
            }
            var firebaseStorageService = new FirebaseStorageService();
            var avatarFileName = $"avatars/{coderId}.jpg";
            var avatarUrl = await firebaseStorageService.UploadImageAsync(avatarFileName, dto.AvatarFile.OpenReadStream());
            coder.Avatar = avatarUrl;
            await _context.SaveChangesAsync();
            return avatarUrl;
        }
        public async Task<List<RankingDTO>> GetRankingByTotalSolvedAsync()
        {
            List<int> coderIds = await _context.Submissions
                .Where(s => s.TestResult == "Accepted" && s.MaxTimeDuration != null && s.TakePartID == null)
                .Select(s => s.CoderID)
                .Distinct()
                .ToListAsync();

            var coders = await _context.Coders
                .Where(c => coderIds.Contains(c.CoderID))
                .Select(c => new
                {
                    c.CoderID,
                    c.CoderName,
                    c.Avatar
                })
                .ToListAsync();

            var timeScores = await _context.Submissions
                .Where(s => coderIds.Contains(s.CoderID) && s.TestResult == "Accepted" && s.MaxTimeDuration != null && s.TakePartID == null)
                .GroupBy(s => s.CoderID)
                .Select(g => new
                {
                    CoderID = g.Key,
                    TotalTime = g.Sum(s => s.MaxTimeDuration ?? 0)
                })
                .ToListAsync();

            var solvedCounts = await _context.Solved
                .Where(s => coderIds.Contains(s.CoderID))
                .GroupBy(s => s.CoderID)
                .Select(g => new
                {
                    CoderID = g.Key,
                    SolvedCount = g.Count()
                })
                .ToListAsync();

            var rankings = coders
                .Select(c => new RankingDTO
                {
                    CoderID = c.CoderID,
                    CoderName = c.CoderName,
                    Avatar = c.Avatar,
                    TimeScore = timeScores.FirstOrDefault(ts => ts.CoderID == c.CoderID)?.TotalTime ?? int.MaxValue,
                    SolvedCount = solvedCounts.FirstOrDefault(sc => sc.CoderID == c.CoderID)?.SolvedCount ?? 0
                })
                .OrderByDescending(r => r.SolvedCount)
                .ThenBy(r => r.TimeScore)
                .ToList();

            int rank = 1;
            foreach (var r in rankings)
            {
                r.Rank = rank++;
            }

            return rankings;
        }
        public async Task<bool> ChangePwdWhenForgotPwdAsync(string email, string newPassword)
        {
            var coder = await _context.Coders
                .Include(c => c.Account)
                .FirstOrDefaultAsync(c => c.CoderEmail == email);

            if (coder == null || coder.Account == null)
                return false;

            string salt = PasswordHelper.GenerateSalt();
            string hashedPassword = HashPassword(newPassword, salt);

            coder.Account.Password = hashedPassword;
            coder.Account.SaltMD5 = salt;
            coder.Account.PwdResetCode = null;
            coder.Account.PwdResetDate = null;

            await _context.SaveChangesAsync();
            return true;
        }



    }
}
