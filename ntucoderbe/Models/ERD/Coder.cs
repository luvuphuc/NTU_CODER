using ntucoderbe.Infrashtructure.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
#pragma warning disable CS8618 // Non-nullable field
namespace ntucoderbe.Models.ERD
{
    public class Coder
    {
        public Coder()
        {
            Submissions = new HashSet<Submission>();
            Comments = new HashSet<Comment>();
            Blogs = new HashSet<Blog>();
            Solveds = new HashSet<Solved>();
            Favourites = new HashSet<Favourite>();
            Problems = new HashSet<Problem>();
            Participations = new HashSet<Participation>();
            Contests = new HashSet<Contest>();
        }
        [Key, ForeignKey("Account")]
        public int CoderID { get; set; }

        [Required]
        [MaxLength(100)]
        public string CoderName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string CoderEmail { get; set; }

        [MaxLength(10)]
        [Phone]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        public string? Avatar { get; set; }
        [MaxLength(100)]
        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(100)]
        public string? CreatedBy { get; set; }

        public GenderEnum? Gender { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedAt { get; set; } = null;
        [MaxLength(100)]
        public string? UpdatedBy { get; set; }

        [JsonIgnore]
        public virtual Account Account { get; set; }

        [JsonIgnore]
        public ICollection<Blog> Blogs { get; set; }
        [JsonIgnore]
        public virtual ICollection<Comment> Comments { get; set; }
        [JsonIgnore]
        public virtual ICollection<Submission> Submissions { get; set; }
        [JsonIgnore]
        public virtual ICollection<Solved> Solveds { get; set; }

        [JsonIgnore]
        public virtual ICollection<Problem> Problems { get; set; }
        [JsonIgnore]
        public virtual ICollection<Contest> Contests { get; set; }
        [JsonIgnore]
        public virtual ICollection<Favourite> Favourites { get; set; }
        [JsonIgnore]
        public virtual ICollection<Participation> Participations { get; set; }
    }
}
