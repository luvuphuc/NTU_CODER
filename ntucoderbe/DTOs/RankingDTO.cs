namespace ntucoderbe.DTOs
{
    public class RankingDTO
    {
        public int Rank {  get; set; }  
        public int? CoderID { get; set; }
        public string? CoderName { get; set; }
        public int? ParticipationID { get; set; }
        public int? PointScore { get; set; }
        public string? CompilerName { get; set; }
        public int? TimeScore { get; set; }
        public string? Avatar {  get; set; }
        public int? SolvedCount { get; set; }
    }
}
