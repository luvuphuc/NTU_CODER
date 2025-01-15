namespace ntucoderbe.DTOs
{
    public class CommentDTO
    {
        public int CommentID { get; set; }
        public string Content { get; set; }
        public DateTime CommentTime { get; set; }
        public string CoderName { get; set; }
        public int BlogID { get; set; }
        public string BlogName { get; set; }
    }
}
