using System.Security.Cryptography;
using System.Text;

namespace ntucoderbe.Infrashtructure.Helpers
{
    public static class PasswordHelper
    {
        private const int SaltSize = 16;
        public static string GenerateSalt()
        {
            byte[] salt = new byte[SaltSize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            return Convert.ToBase64String(salt);
        }
        public static string HashPassword(string password, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + salt));
                return Convert.ToBase64String(hash);
            }
        }
        public static bool VerifyPassword(string inputPassword, string storedHash, string salt)
        {
            string hashedInput = HashPassword(inputPassword, salt);
            return hashedInput == storedHash;
        }
    }
}
