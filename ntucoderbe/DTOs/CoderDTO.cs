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
    }
    public class CreateCoderDTO : CoderDTO
    {
        public string Password { get; set; }
        public int Role {  get; set; }
    }
    public class CoderDetailDTO: CoderDTO
    {
        public IFormFile? AvatarFile { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public GenderEnum? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public int? RoleID {  get; set; }
        public string? Avatar { get; set; }
        public string? Description { get; set; }

    }
    public class CoderWithLanguageDTO : CoderDetailDTO 
    {
        public List<LanguageDTO> Languages { get; set; } = new List<LanguageDTO>();
        public int? CountProblemSolved { get; set; }
        public int? CountFavourites { get; set; }
    }

    public class LanguageDTO
    {
        public string? CompilerName { get; set; }
        public int SolvedCount { get; set; }
    }
}
