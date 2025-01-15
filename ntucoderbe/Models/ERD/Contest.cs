using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ntucoderbe.Models.ERD
{
    public class Contest
    {
        [Key]
        public int ContestID { get; set; }
        [ForeignKey("Coder")]
        public int CoderID { get; set; }
        [Required]
        public string ContestName { get; set; }
        public string? ContestDescription { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        public string? RuleType { get; set; }
        public string? FailedPenalty { get; set; }
        public int Published { get; set; } = 0;
        public int Status { get; set; } = 0;
        public int Duration { get; set; }
        public string? RankingFinished { get; set; }
        public int? FrozenTime { get; set; }

        public virtual Coder Coder { get; set; }
        public virtual ICollection<Participation> Participations { get; set; } = new HashSet<Participation>();
        public virtual ICollection<HasProblem> HasProblems { get; set; } = new HashSet<HasProblem>();
        public virtual ICollection<Announcement> Announcements { get; set; } = new HashSet<Announcement>();


    }
}
