using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ntucoderbe.Models.ERD
{
    public class Favourite
    {
        [ForeignKey("Coder")]
        public int CoderID { get; set; }
        [ForeignKey("Problem")]
        public int ProblemID { get; set; }
        [MaxLength(50)]
        public string? Note { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual Problem Problem { get; set; }
    }
}
