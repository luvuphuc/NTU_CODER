﻿namespace ntucoderbe.DTOs
{
    public class BlogDTO
    {
        public int BlogID { get; set; }
        public string? Title { get; set; }
        public DateTime? BlogDate { get; set; }
        public string? Content { get; set; }
        public int? Published { get; set; }
        public int? PinHome { get; set; }
        public int? CoderID { get; set; }
        public string? CoderName { get; set; }
        public string? CoderAvatar { get; set; }
        public int? CountComment { get; set; }
        
    }
}
