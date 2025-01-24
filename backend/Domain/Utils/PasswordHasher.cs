namespace Domain
{
    public class PasswordHasher
    {
        private const int saltSize = 16;

        public static string GenerateSalt()
        {
            return BCrypt.Net.BCrypt.GenerateSalt(saltSize);
        }

        public static string HashPassword(string password, string salt, int rounds)
        {
            string saltedPassword = password + salt;
            return BCrypt.Net.BCrypt.HashPassword(saltedPassword, rounds);
        }

        public static bool VerifyPassword(string password, string salt, string hashedPassword)
        {
            string saltedPassword = password + salt;
            return BCrypt.Net.BCrypt.Verify(saltedPassword, hashedPassword);
        }
    }
}
