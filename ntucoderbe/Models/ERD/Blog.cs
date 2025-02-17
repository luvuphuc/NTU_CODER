namespace ntucoderbe.Models.ERD
{
    public class Blog
    {

        public int BlogID { get; set; }
        public string Title { get; set; }
        public DateTime BlogDate { get; set; }
        public string Content { get; set; }
        public int Published { get; set; }
        public int PinHome { get; set; }
        public int CoderID { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();

    }
}
