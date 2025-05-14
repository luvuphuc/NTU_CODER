namespace ntucoderbe.DTOs
{
    public class AnnouncementDTO
    {
        public int AnnouncementID { get; set; }
        public int? ContestID { get; set; }
        public string? ContestName { get; set; }
        public DateTime AnnouncementTime { get; set; }
        public string? AnnounceContent { get; set; }
        public int? IsSent { get; set; }
    }
}
