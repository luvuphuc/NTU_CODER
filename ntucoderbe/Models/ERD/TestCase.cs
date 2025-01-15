using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ntucoderbe.Models.ERD
{
    public class TestCase
    {
        [Key]
        public int TestCaseID { get; set; }
        [Required]
        [ForeignKey("Problem")]
        public int ProblemID { get; set; }
        [Required]
        public int TestCaseOrder { get; set; }
        public string? SampleTest { get; set; }
        public string? PreTest { get; set; }
        [Required]
        public string Input { get; set; }
        [Required]
        public string Output { get; set; }

        public virtual Problem Problem { get; set; }
        public virtual ICollection<TestRun> TestRuns { get; set; } = new HashSet<TestRun>();
    }
}
