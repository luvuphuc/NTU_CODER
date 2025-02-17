namespace ntucoderbe.Models.ERD
{
    public class HasProblem
    {
        public int HasProblemID { get; set; }
        public int ContestID { get; set; }
        public int ProblemID { get; set; }
        public int ProblemOrder { get; set; }
        public int Point { get; set; }

        public virtual Contest Contest { get; set; }
        public virtual Problem Problem { get; set; }
    }

}
