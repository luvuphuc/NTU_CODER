namespace ntucoderbe.Models.ERD
#pragma warning disable CS8618 // Non-nullable field
{
    public class Category
    {
        public int CategoryID { get; set; }
        public string CatName { get; set; }
        public int CatOrder { get; set; }
        public virtual ICollection<ProblemCategory> ProblemCategories { get; set; } = new HashSet<ProblemCategory>();

    }
}
