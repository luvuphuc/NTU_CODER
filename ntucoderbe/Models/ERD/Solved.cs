namespace ntucoderbe.Models.ERD
{
    public class Solved
    {
        public int CoderID { get; set; }
        public int ProblemID { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual Problem Problem { get; set; }
    }
}
