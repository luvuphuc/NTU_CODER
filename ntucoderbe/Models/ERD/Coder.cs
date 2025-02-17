using ntucoderbe.Infrashtructure.Enums;
namespace ntucoderbe.Models.ERD
{
    public class Coder
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

        public DateTime? UpdatedAt { get; set; } = null;

        public string? UpdatedBy { get; set; }

        public virtual Account Account { get; set; }

        public ICollection<Blog> Blogs { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
        public virtual ICollection<Submission> Submissions { get; set; } = new HashSet<Submission>();
        public virtual ICollection<Solved> Solveds { get; set; } = new HashSet<Solved>();
        public virtual ICollection<Problem> Problems { get; set; } = new HashSet<Problem>();
        public virtual ICollection<Contest> Contests { get; set; } = new HashSet<Contest>();
        public virtual ICollection<Favourite> Favourites { get; set; } = new HashSet<Favourite>();
        public virtual ICollection<Participation> Participations { get; set; } = new HashSet<Participation>();
    }

}
