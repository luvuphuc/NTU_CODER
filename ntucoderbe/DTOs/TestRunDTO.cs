namespace ntucoderbe.DTOs
{
    public class TestRunDTO
    {
        public int TestRunID { get; set; }
        public int SubmissionID { get; set; }
        public int TestCaseID { get; set; }
        public int TimeDuration { get; set; }
        public int MemorySize { get; set; }
        public string TestOutput { get; set; }
        public string Result { get; set; }
        public string CheckerLog { get; set; }
    }
}
