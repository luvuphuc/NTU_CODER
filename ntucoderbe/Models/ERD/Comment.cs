using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ntucoderbe.Models.ERD
{
    public class Comment
    {
        [Key]
        public int CommentID { get; set; }
        [ForeignKey("Blog")]
        [Required]
        public int BlogID { get; set; }
        [Required]
        public string Content { get; set; }
        [ForeignKey("Coder")]
        [Required]
        public int CoderID { get; set; }
        public DateTime CommentTime { get; set; } = DateTime.Now;

        public virtual Blog Blog { get; set; }

        public virtual Coder Coder { get; set; }
    }
}
