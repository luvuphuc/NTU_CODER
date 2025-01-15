using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ntucoderbe.Models.ERD
{
    public class HasProblem
    {
        [Key]
        public int HasProblemID { get; set; }

        [Required]
        [ForeignKey("Contest")]
        public int ContestID { get; set; }
        [Required]
        [ForeignKey("Problem")]
        public int ProblemID { get; set; }
        [Required]
        public int ProblemOrder { get; set; }
        [Required]
        public int Point { get; set; }

        public virtual Contest Contest { get; set; }
        public virtual Problem Problem { get; set; }
    }
}
