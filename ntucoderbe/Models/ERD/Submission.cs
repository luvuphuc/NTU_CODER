using System.Text.Json.Serialization;

namespace ntucoderbe.Models.ERD
{
    public class Submission
    {
        public int SubmissionID { get; set; }
        public int CoderID { get; set; }
        public int CompilerID { get; set; }
        public int ProblemID { get; set; }
        public int? TakePartID { get; set; }

        public DateTime SubmitTime { get; set; }
        public string SubmissionCode { get; set; }

        public int SubmissionStatus { get; set; }

        public int? TestRunCount { get; set; }
        public string? TestResult { get; set; }
        public int? MaxTimeDuration { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual Compiler Compiler { get; set; }
        public virtual TakePart TakePart { get; set; }
        public virtual Problem Problem { get; set; }
        [JsonIgnore]
        public virtual ICollection<TestRun> TestRuns { get; set; } = new HashSet<TestRun>();
    }

}
