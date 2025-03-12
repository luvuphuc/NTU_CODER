namespace ntucoderbe.DTOs
{
    public class ContestDTO
    {
        public int ContestID { get; set; }
        public int? CoderID { get; set; }
        public string? ContestName { get; set; }
        public string? ContestDescription { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? RuleType { get; set; }
        public string? FailedPenalty { get; set; }
        public int? Published { get; set; }
        public int? Status { get; set; }
        public int? Duration { get; set; }
        public int? RankingFinished { get; set; }
        public int? FrozenTime { get; set; }
        public string? CoderName { get; set; }
    }
}
