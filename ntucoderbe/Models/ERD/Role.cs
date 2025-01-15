using ntucoderbe.Infrashtructure.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
#pragma warning disable CS8618 // Non-nullable field
namespace ntucoderbe.Models.ERD
{
    public class Role
    {
        public Role()
        {
            Accounts = new HashSet<Account>();
        }
        [Key]
        public int Id { get; set; }
        [Required]
        public RoleEnum Name { get; set; }
        [JsonIgnore]
        public virtual ICollection<Account> Accounts { get; set; }
    }
}
