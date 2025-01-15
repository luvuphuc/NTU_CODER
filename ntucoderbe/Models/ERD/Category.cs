using System.ComponentModel.DataAnnotations;

namespace ntucoderbe.Models.ERD
#pragma warning disable CS8618 // Non-nullable field
{
    public class Category
    {
        [Key]
        public int CategoryID { get; set; }
        [Required]
        [MaxLength(100)]
        public string CatName { get; set; }
        [Required]
        public int CatOrder { get; set; }
        public virtual ICollection<ProblemCategory> ProblemCategories { get; set; } = new HashSet<ProblemCategory>();

    }
}
