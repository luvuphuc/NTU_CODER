using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Helpers;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using ntucoderbe.Validator;
using System;
using System.Security.Cryptography;
using System.Text;

namespace ntucoderbe.Infrashtructure.Repositories
{
    public class CoderRepository : ICoderRepository
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
            var validator = new CoderValidator();
            var validationResult = await validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }
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
                RoleID = 2
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            var coder = new Coder
            {
                CoderID = account.AccountID,
                CoderName = dto.CoderName!,
                CoderEmail = dto.CoderEmail!,
                PhoneNumber = dto.PhoneNumber,
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

        public Task<CoderDTO> DeleteCoderAsync(int id)
        {
            throw new NotImplementedException();
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
                UpdatedBy = coder.UpdatedBy
            };
        }

        public async Task<CoderDTO> UpdateCoderAsync(int id, CreateCoderDTO dto)
        {
            var existing = await _context.Coders.FindAsync(id);
            if (existing == null)
            {
                throw new KeyNotFoundException("Không tìm thấy.");
            }
            if (await CheckEmailExist(dto.CoderEmail!) && dto.CoderEmail != existing.CoderEmail)
            {
                throw new InvalidOperationException("Email đã tồn tại.");
            }

            if (await CheckUserExist(dto.UserName!) && dto.UserName != existing.Account.UserName)
            {
                throw new InvalidOperationException("Tên đăng nhập đã tồn tại.");
            }

            existing.CoderName = dto.CoderName!;
            existing.CoderEmail = dto.CoderEmail!;
            existing.PhoneNumber = dto.PhoneNumber;
            existing.UpdatedAt = DateTime.UtcNow;
            existing.UpdatedBy = "admin";

            _context.Coders.Update(existing);
            await _context.SaveChangesAsync();
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountID == existing.CoderID);
            if (account != null && (dto.UserName != account.UserName || dto.Password != account.Password))
            {
                var salt = PasswordHelper.GenerateSalt();
                var hashedPassword = HashPassword(dto.Password!, salt);
                account.UserName = dto.UserName!;
                account.Password = hashedPassword;
                account.SaltMD5 = salt;
                _context.Accounts.Update(account);
                await _context.SaveChangesAsync();
            }

            return new CoderDTO
            {
                CoderID = existing.CoderID,
                UserName = existing.Account.UserName,
                CoderName = existing.CoderName,
                CoderEmail = existing.CoderEmail,
                PhoneNumber = existing.PhoneNumber
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
    }
}
