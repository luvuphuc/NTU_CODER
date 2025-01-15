using Microsoft.EntityFrameworkCore;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Coder> Coders { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Compiler> Compilers { get; set; }
        public DbSet<Contest> Contest { get; set; }
        public DbSet<Favourite> Favorites { get; set; }
        public DbSet<HasProblem> HasProblems { get; set; }
        public DbSet<Participation> Participations { get; set; }
        public DbSet<Problem> Problems { get; set; }
        public DbSet<ProblemCategory> ProblemCategories { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Solved> Solved { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<TakePart> TakeParts { get; set; }
        public DbSet<TestCase> TestCases { get; set; }
        public DbSet<TestRun> TestRuns { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Favourite>()
                .HasKey(f => new { f.CoderID, f.ProblemID });
            modelBuilder.Entity<Solved>()
                .HasKey(s => new { s.CoderID, s.ProblemID });
            modelBuilder.Entity<ProblemCategory>()
                .HasKey(pc => new { pc.ProblemID, pc.CategoryID });
        }

    }
}
