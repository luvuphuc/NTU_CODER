using ntucoderbe.Infrashtructure.Enums;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
#pragma warning disable CS8618 // Non-nullable field
namespace ntucoderbe.Models.ERD
{
    public class Account
    {
        [Key]
        public int AccountID { get; set; }
        [Required]
        [MaxLength(30)]
        public string UserName { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        [JsonIgnore]
        public string SaltMD5 { get; set; }
        [JsonIgnore]
        public string? PwdResetCode { get; set; }
        [JsonIgnore]
        public DateTime? PwdResetDate { get; set; }
        [EmailAddress]
        [JsonIgnore]
        public string? ReceiveEmail { get; set; }
        [Required]
        [ForeignKey("Role")]
        public int RoleID { get; set; }
        [JsonIgnore]
        public virtual Role Role { get; set; }
        [JsonIgnore]
        public virtual Coder Coder { get; set; }
    }
}
