using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
#pragma warning disable CS8618 // Non-nullable field
namespace ntucoderbe.Models.ERD
{
    public class TakePart
    {
        [Key]
        public int TakePartID { get; set; }
        [ForeignKey("Participation")]
        [Required]
        public int ParticipationID { get; set; }
        [ForeignKey("Problem")]
        [Required]
        public int ProblemID { get; set; }
        public int? TimeSolved { get; set; }
        public int? PointWon { get; set; }
        public int? MaxPoint { get; set; }
        public int? SubmissionCount { get; set; }
        public int? FrozenTimeSol { get; set; }
        public virtual Participation Participation { get; set; }
        public virtual Problem Problem { get; set; }
        public virtual ICollection<Submission> Submissions { get; set; } = new HashSet<Submission>();

    }
}
