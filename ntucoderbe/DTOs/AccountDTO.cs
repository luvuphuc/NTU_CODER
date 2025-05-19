namespace ntucoderbe.DTOs
{
    public class AccountDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }

    }
    public class ResetPasswordDTO
    {
        public string Email { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string? NewPassword { get; set; }
    }

}
