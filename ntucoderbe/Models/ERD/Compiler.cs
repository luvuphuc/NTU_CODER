using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ntucoderbe.Models.ERD
{
    public class Compiler
    {
        public Compiler()
        {
            Submissions = new HashSet<Submission>();
            Problems = new HashSet<Problem>();
        }
        [Key]
        public int CompilerID { get; set; }
        [Required]
        [MaxLength(20)]
        public string CompilerName { get; set; }
        [Required]
        public string CompilerPath { get; set; }
        public int CompilerOption { get; set; }
        public string? CompilerExtension { get; set; }
        [JsonIgnore]
        public virtual ICollection<Submission> Submissions { get; set; }
        public virtual ICollection<Problem> Problems { get; set; }
    }
}
