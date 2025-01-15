using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
#pragma warning disable CS8618 // Non-nullable field
namespace ntucoderbe.Models.ERD
{
    public class Blog
    {
        public Blog()
        {
            Comments = new HashSet<Comment>();
        }
        [Key]
        public int BlogID { get; set; }
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }
        public DateTime BlogDate { get; set; } = DateTime.UtcNow;
        [Required]
        public string Content { get; set; }
        public int Published { get; set; } = 0;
        public int PinHome { get; set; } = 0;

        [ForeignKey("CoderID")]
        public int CoderID { get; set; }
        [JsonIgnore]
        public virtual Coder Coder { get; set; }
        [JsonIgnore]
        public virtual ICollection<Comment> Comments { get; set; }

    }
}
