namespace ntucoderbe.Models.ERD
{
    public class Contest
    {
        public int ContestID { get; set; }
        public int CoderID { get; set; }

        public string ContestName { get; set; }
        public string? ContestDescription { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string RuleType { get; set; }
        public int FailedPenalty { get; set; }
        public int Published { get; set; }
        public int Status { get; set; }
        public int Duration { get; set; }
        public int? RankingFinished { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual ICollection<Participation> Participations { get; set; } = new HashSet<Participation>();
        public virtual ICollection<HasProblem> HasProblems { get; set; } =  new HashSet<HasProblem>();
        public virtual ICollection<Announcement> Announcements { get; set; } = new HashSet<Announcement>();
    }

}
