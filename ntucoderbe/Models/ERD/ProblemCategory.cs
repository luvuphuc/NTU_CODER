namespace ntucoderbe.Models.ERD
{
    public class ProblemCategory
    {
        public int ProblemID { get; set; }
        public int CategoryID { get; set; }

        public virtual Problem Problem { get; set; }
        public virtual Category Category { get; set; }
    }

}
