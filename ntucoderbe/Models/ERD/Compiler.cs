namespace ntucoderbe.Models.ERD
{
    public class Compiler
    {
        public int CompilerID { get; set; }
        public string CompilerName { get; set; }
        public string CompilerPath { get; set; }
        public int CompilerOption { get; set; }
        public string? CompilerExtension { get; set; }
        public virtual ICollection<Submission> Submissions { get; set; } = new HashSet<Submission>();
        public virtual ICollection<Problem> Problems { get; set; } = new HashSet<Problem>();
    }

}
