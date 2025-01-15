using ntucoderbe.Models.ERD;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ntucoderbe.DTOs
{
    public class AccountDTO
    {
        public int AccountID { get; set; }
        [MaxLength(30)]
        [Required]
        public string UserName { get; set; }
    }
}
