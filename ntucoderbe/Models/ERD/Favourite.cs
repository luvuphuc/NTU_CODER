namespace ntucoderbe.Models.ERD
{
    public class Favourite
    {
        public int CoderID { get; set; }
        public int ProblemID { get; set; }
        public string? Note { get; set; }

        public virtual Coder Coder { get; set; }
        public virtual Problem Problem { get; set; }
    }

}
