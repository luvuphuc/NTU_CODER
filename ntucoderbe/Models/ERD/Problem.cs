namespace ntucoderbe.Models.ERD
{
    public class Problem
    {
        public int ProblemID { get; set; }
        public string ProblemName { get; set; }
        public string ProblemCode { get; set; }
        public float TimeLimit { get; set; }
        public int MemoryLimit { get; set; }
        public string ProblemContent { get; set; }
        public string? ProblemExplanation { get; set; }
        public string TestType { get; set; }
        public string TestCode { get; set; }
        public string? TestProgCompile { get; set; }
        public int CoderID { get; set; }
        public int Published { get; set; }
        public int TestCompilerID { get; set; }

        public virtual Compiler Compiler { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual ICollection<TestCase> TestCases { get; set; } = new HashSet<TestCase>();
        public virtual ICollection<Solved> Solveds { get; set; } = new HashSet<Solved>();
        public virtual ICollection<ProblemCategory> ProblemCategories { get; set; } = new HashSet<ProblemCategory>();
        public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public virtual ICollection<TakePart> TakeParts { get; set; } = new List<TakePart>();
        public virtual ICollection<Favourite> Favourites { get; set; } = new HashSet<Favourite>();
        public virtual ICollection<HasProblem> HasProblems { get; set; }= new HashSet<HasProblem>();
    }

}
