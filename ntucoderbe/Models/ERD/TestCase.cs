namespace ntucoderbe.Models.ERD
{
    public class TestCase
    {
        public int TestCaseID { get; set; }
        public int ProblemID { get; set; }
        public int TestCaseOrder { get; set; }
        public int SampleTest { get; set; }
        public int PreTest { get; set; }
        public string Input { get; set; }
        public string Output { get; set; }

        public virtual Problem Problem { get; set; }
        public virtual ICollection<TestRun> TestRuns { get; set; } = new HashSet<TestRun>();
    }

}
