namespace ntucoderbe.DTOs
{
    public class SubmisstionDTO
    {
        public int SubmissionID { get; set; }
        public int? CoderID { get; set; }
        public string? CoderName { get; set; }
        public int? CompilerID { get; set; }
        public string? CompilerName { get; set; } 
        public int? ProblemID { get; set; }
        public string? ProblemName { get; set; }
        public DateTime SubmitTime { get; set; }
        public int SubmissionStatus { get; set; }
        public int? SubmitLineCount { get; set; }
        public int? TestRunCount { get; set; }
        public string? TestResult { get; set; }
        public string? MaxMemorySize { get; set; }
        public string? MaxTimeDuration { get; set; }
    }
}
