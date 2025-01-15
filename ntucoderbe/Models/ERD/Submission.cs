using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
#pragma warning disable CS8618 // Non-nullable field
namespace ntucoderbe.Models.ERD
{
    public class Submission
    {
        [Key]
        public int SubmissionID { get; set; }
        [ForeignKey("Coder")]
        public int CoderID { get; set; }
        [ForeignKey("Compiler")]
        public int CompilerID { get; set; }
        [ForeignKey("Problem")]
        public int ProblemID { get; set; }
        [ForeignKey("TakePart")]
        public int TakePartID { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime SubmitTime { get; set; }
        [Required]
        public string SubmissionCode { get; set; }

        public int SubmissionStatus { get; set; } = 0;

        public int? SubmitLineCount { get; set; }

        public int? TestRunCount { get; set; }
        public string? TestResult { get; set; }
        public string? MaxMemorySize { get; set; }
        public string? MaxTimeDuration { get; set; }
        public string? SubmitMinute { get; set; }

        [JsonIgnore]
        public virtual Coder Coder { get; set; }

        [JsonIgnore]
        public virtual Compiler Compiler { get; set; }
        public virtual TakePart TakePart { get; set; }
        public virtual Problem Problem { get; set; }
        public virtual ICollection<TestRun> TestRuns { get; set; } = new HashSet<TestRun>();
    }
}
