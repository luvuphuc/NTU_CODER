namespace ntucoderbe.DTOs
{
    public class TestCaseDTO
    {
        public int TestCaseID { get; set; }
        public int ProblemID { get; set; }
        public int TestCaseOrder { get; set; }
        public string? SampleTest { get; set; }
        public string? PreTest { get; set; }
        public string Input { get; set; }
        public string Output { get; set; }
    }
}
