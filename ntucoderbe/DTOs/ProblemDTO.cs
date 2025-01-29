namespace ntucoderbe.DTOs
{
    public class ProblemDTO
    {
        public int ProblemID { get; set; }
        public string? ProblemName { get; set; }
        public string? ProblemCode { get; set; }
        public float? TimeLimit { get; set; }
        public int? MemoryLimit { get; set; }
        public string? ProblemContent { get; set; }
        public string? ProblemExplanation { get; set; }
        public string? TestType { get; set; }
        public string? TestCode { get; set; }
        public string? TestProgCompile { get; set; }
        public int? CoderID { get; set; }
        public int? Published { get; set; }
        public int? TestCompilerID { get; set; }
        public string? CoderName { get; set; }
        public string? TestCompilerName { get; set; }
        public List<int> SelectedCategoryIDs { get; set; } = new List<int>();
        public List<string> SelectedCategoryNames { get; set; } = new List<string>();
    }

}
