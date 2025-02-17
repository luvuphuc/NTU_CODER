namespace ntucoderbe.Models.ERD
{
    public class TakePart
    {
        public int TakePartID { get; set; }
        public int ParticipationID { get; set; }
        public int ProblemID { get; set; }
        public int? TimeSolved { get; set; }
        public int? PointWon { get; set; }
        public int? MaxPoint { get; set; }
        public int? SubmissionCount { get; set; }
        public int? FrozenTimeSol { get; set; }

        public virtual Participation Participation { get; set; }
        public virtual Problem Problem { get; set; }
        public virtual ICollection<Submission> Submissions { get; set; } = new HashSet<Submission>();
    }

}
