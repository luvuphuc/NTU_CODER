using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ntucoderbe.Models.ERD;
using ntucoderbe.Infrashtructure.Enums;
using Microsoft.AspNetCore.Http;
using ntucoderbe.Infrashtructure.Helpers;
using ntucoderbe.Models;
using Microsoft.EntityFrameworkCore;

namespace ntucoderbe.Infrashtructure.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly EmailHelper _emailHelper;

        public AuthService(ApplicationDbContext context, IConfiguration config, IHttpContextAccessor httpContextAccessor, EmailHelper emailHelper)
        {
            _context = context;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _emailHelper = emailHelper;
        }

        public async Task<(string?, Account?)> AuthenticateAsync(string username, string password)
        {
            var user = await _context.Accounts
                .Include(a => a.Coder).FirstOrDefaultAsync(a =>
            a.UserName == username ||
            (a.Coder != null && a.Coder.CoderEmail == username)
        );
            if (user == null || !PasswordHelper.VerifyPassword(password, user.Password, user.SaltMD5))
            {
                return (null, null);
            }

            string token = GenerateJwtToken(user);
            return (token, user);
        }

        public string GenerateJwtToken(Account user)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtConfig:SecretKey"]);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.AccountID.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim(ClaimTypes.Role, user.RoleID.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtConfig:Issuer"],
                audience: _config["JwtConfig:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["JwtConfig:ExpireMinutes"])),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public int GetUserIdFromToken()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : -1;
        }
        public async Task<Account> CreateGoogleUserAsync(string email, string name, string pictureUrl)
        {
            if (await _context.Accounts.AnyAsync(a => a.UserName == email))
            {
                throw new InvalidOperationException("Email đã tồn tại.");
            }

            var account = new Account
            {
                UserName = email,
                Password = "", 
                SaltMD5 = "",
                RoleID = 2, 
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            var coder = new Coder
            {
                CoderID = account.AccountID,
                CoderName = name,
                CoderEmail = email,
                PhoneNumber = null,
                Gender = Enums.GenderEnum.Other,
                Avatar = pictureUrl,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "google",
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "google"
            };

            _context.Coders.Add(coder);
            await _context.SaveChangesAsync();

            return account;
        }

        public async Task<string?> HandleForgotPasswordAsync(string email)
        {
            var account = await _context.Accounts
                .Include(a => a.Coder)
                .FirstOrDefaultAsync(a => a.Coder.CoderEmail == email);

            if (account == null)
                return null;

            var resetCode = Guid.NewGuid().ToString();
            account.PwdResetCode = resetCode;
            account.PwdResetDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var resetLink = $"{_config["ClientApp:BaseUrl"]}/reset-password?code={resetCode}";
            var subject = "Yêu cầu đặt lại mật khẩu";
            var body = $@"
            <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
            <p>Vui lòng click vào link bên dưới để tiếp tục:</p>
            <a href='{resetLink}'>{resetLink}</a>
            <p>Link có hiệu lực trong 30 phút.</p>
        ";

            await _emailHelper.SendEmailAsync(email, subject, body);

            return "Link đặt lại mật khẩu đã được gửi đến email.";
        }


    }
}
