namespace ntucoderbe.DTOs
{
    public class ParticipationDTO
    {
        public int ParticipationID { get; set; }
        public int CoderID { get; set; }
        public string? CoderName { get; set; }
        public int ContestID { get; set; }
        public string? ContestName { get; set; }
        public DateTime RegisterTime { get; set; }
        public int? PointScore { get; set; }
        public int? TimeScore { get; set; }
        public int? Rank { get; set; }
        public int? SolvedCount { get; set; }
        public string? RegisterMAC { get; set; }
    }
}
