using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ntucoderbe.Models.ERD
{
    public class Solved
    {
        [ForeignKey("Coder")]
        public int CoderID { get; set; }
        [ForeignKey("Problem")]
        public int ProblemID { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual Problem Problem { get; set; }
    }
}
