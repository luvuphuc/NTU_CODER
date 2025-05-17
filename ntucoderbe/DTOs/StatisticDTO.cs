namespace ntucoderbe.DTOs
{
    public class CardStatisticDTO
    {
        public int TotalCoders { get; set; }
        public int TotalProblems { get; set; }
        public int TotalSubmissions { get; set; }
        public int TotalContests { get; set; }
    }
    public class UserGrowthDTO
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public int NewUsers { get; set; }
    }
    public class SubmissionActivityDTO
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public int SubmissionCount { get; set; }
    }
    public class TopProblemDTO
    {
        public int ProblemId { get; set; }
        public string ProblemName { get; set; }
        public int SubmissionCount { get; set; }
    }
}
