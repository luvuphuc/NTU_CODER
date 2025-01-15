using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ntucoderbe.Models.ERD
#pragma warning disable CS8618 // Non-nullable field
{
    public class Announcement
    {
        [Key]
        public int AnnouncementID { get; set; }
        [Required]
        [ForeignKey("Contest")]
        public int ContestID { get; set; }
        public DateTime AnnounceTime { get; set; } = DateTime.UtcNow;
        [Required]
        public string AnnounceContent { get; set; }
        [JsonIgnore]
        public virtual Contest Contest { get; set; }
    }
}
