namespace ntucoderbe.Models.ERD
{
    public class Comment
    {
        public int CommentID { get; set; }
        public int BlogID { get; set; }
        public string Content { get; set; }
        public int CoderID { get; set; }
        public DateTime CommentTime { get; set; }

        public virtual Blog Blog { get; set; }
        public virtual Coder Coder { get; set; }
    }

}
