using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ntucoderbe.Models.ERD
{
    public class TestRun
    {
        [Key]
        public int TestRunID { get; set; }
        [Required]
        [ForeignKey("Submission")]
        public int SubmissionID { get; set; }
        [Required]
        [ForeignKey("TestCase")]
        public int TestCaseID { get; set; }
        public int TimeDuration { get; set; }
        public int MemorySize { get; set; }
        public string TestOutput { get; set; }
        public string Result { get; set; }
        public string CheckerLog { get; set; }
        public virtual Submission Submission { get; set; }
        public virtual TestCase TestCase { get; set; }
    }
}
