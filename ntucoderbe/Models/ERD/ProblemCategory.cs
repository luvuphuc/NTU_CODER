using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ntucoderbe.Models.ERD
{
    public class ProblemCategory
    {
        [ForeignKey("Problem")]
        public int ProblemID { get; set; }
        [ForeignKey("Category")]
        public int CategoryID { get; set; }
        public string? Note { get; set; }
        public virtual Problem Problem { get; set; }
        public virtual Category Category { get; set; }
    }
}
