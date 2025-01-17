using System.Security.Cryptography;

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
    }
}
