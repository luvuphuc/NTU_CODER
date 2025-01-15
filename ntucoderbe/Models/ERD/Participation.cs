using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
#pragma warning disable CS8618 // Non-nullable field
namespace ntucoderbe.Models.ERD
{
    public class Participation
    {
        public Participation()
        {
            TakeParts = new HashSet<TakePart>();
        }
        [Key]
        public int ParticipationID { get; set; }

        [ForeignKey("Coder")]
        public int CoderID { get; set; }
        [ForeignKey("Contest")]
        public int ContestID { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime RegisterTime { get; set; } = DateTime.Now;
        public int? PointScore { get; set; }
        public int? TimeScore { get; set; }
        public int? Rank { get; set; }
        public int? SolvedCount { get; set; }
        public string? RegisterMAC { get; set; }
        public virtual Coder Coder { get; set; }

        public virtual Contest Contest { get; set; }
        public virtual ICollection<TakePart> TakeParts { get; set; }
    }
}
