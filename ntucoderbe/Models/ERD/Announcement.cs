namespace ntucoderbe.Models.ERD
#pragma warning disable CS8618 // Non-nullable field
{
    public class Announcement
    {
        public int AnnouncementID { get; set; }
        public int ContestID { get; set; }
        public DateTime AnnounceTime { get; set; }
        public string AnnounceContent { get; set; }
        public int IsSent {  get; set; }
        public virtual Contest Contest { get; set; }
    }
}
