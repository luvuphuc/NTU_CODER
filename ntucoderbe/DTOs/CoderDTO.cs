using ntucoderbe.Infrashtructure.Enums;

namespace ntucoderbe.DTOs
{
    public class CoderDTO
    {
        public int CoderID { get; set; }
        public string CoderName { get; set; }
        public string CoderEmail { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Avatar { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public GenderEnum? Gender { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public AccountDTO Account { get; set; }
    }
}
