using ntucoderbe.Infrashtructure.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ntucoderbe.DTOs
{
    public class CoderDTO
    {
        public int CoderID { get; set; }
        public string? UserName { get; set; }
        public string? CoderName { get; set; }
        public string? CoderEmail { get; set; }
        public string? PhoneNumber { get; set; }
    
        public string? Password { get; set; }
        public string? OldPassword { get; set; }
        public int? Role {  get; set; }
        public IFormFile? AvatarFile { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public GenderEnum? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public int? RoleID { get; set; }
        public string? Avatar { get; set; }
        public string? Description { get; set; }
        public int? CountProblemSolved { get; set; }
        public int? CountFavourites { get; set; }
    }
    public class CoderWithLanguageDTO : CoderDTO
    {
        public List<LanguageDTO> Languages { get; set; } = new List<LanguageDTO>();

    }

    public class LanguageDTO
    {
        public string? CompilerName { get; set; }
        public int SolvedCount { get; set; }
    }
}
