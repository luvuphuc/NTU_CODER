using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Models.ERD;
using ntucoderbe.Models;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using ntucoderbe.Infrashtructure.Helpers;
using ntucoderbe.Infrashtructure.Enums;
namespace ntucoderbe.Infrashtructure.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(ApplicationDbContext context, IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<(string?, Account?)> AuthenticateAsync(string username, string password)
        {
            var user = await _context.Accounts.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null) return (null, null);

            if (!PasswordHelper.VerifyPassword(password, user.Password, user.SaltMD5))
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
                new Claim(JwtRegisteredClaimNames.Sub, user.AccountID.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim(ClaimTypes.Role, Enum.GetName(typeof(RoleEnum), user.RoleID))

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
        public int? GetUserIdFromSession()
        {
            return _httpContextAccessor.HttpContext?.Session.GetInt32("UserID");
        }
        public void SaveUserSession(int userId)
        {
            _httpContextAccessor.HttpContext?.Session.SetInt32("UserID", userId);
        }

        public bool VerifyPassword(string inputPassword, string storedHash, string salt)
        {
            return PasswordHelper.VerifyPassword(inputPassword, storedHash, salt);
        }
    }
}
