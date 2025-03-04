using System.Text.Json.Serialization;

namespace ntucoderbe.Models.ERD
{
    public class TestRun
    {
        public int TestRunID { get; set; }
        public int SubmissionID { get; set; }
        public int TestCaseID { get; set; }
        public int TimeDuration { get; set; }
        public int MemorySize { get; set; }
        public string TestOutput { get; set; }
        public string Result { get; set; }
        public string CheckerLog { get; set; }
        [JsonIgnore]
        public virtual Submission Submission { get; set; }
        [JsonIgnore]
        public virtual TestCase TestCase { get; set; }
    }

}
