namespace ntucoderbe.DTOs
{
    public class TakePartDTO
    {
        public int TakePartID { get; set; }
        public int ParticipationID { get; set; }
        public int? CoderID { get; set; }
        public int? ContestID { get; set; }
        public string? CoderName { get; set; }
        public int ProblemID { get; set; }
        public string? ProblemName { get; set; }
        public int? TimeSolved { get; set; }
        public int? PointWon { get; set; }
        public int? MaxPoint { get; set; }
        public int? SubmissionCount { get; set; }
        public int? FrozenTimeSol { get; set; }
    }
}
