namespace ntucoderbe.Models.ERD
{
    public class Participation
    {
        public Participation()
        {
            TakeParts = new HashSet<TakePart>();
        }

        public int ParticipationID { get; set; }
        public int CoderID { get; set; }
        public int ContestID { get; set; }
        public DateTime RegisterTime { get; set; }
        public int? PointScore { get; set; }
        public int? TimeScore { get; set; }
        public int? Rank { get; set; }
        public int? SolvedCount { get; set; }
        public int IsReceive { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual Contest Contest { get; set; }
        public virtual ICollection<TakePart> TakeParts { get; set; }
    }

}
