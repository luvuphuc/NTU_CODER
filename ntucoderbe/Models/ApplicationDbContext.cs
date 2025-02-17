using Microsoft.EntityFrameworkCore;
using ntucoderbe.Infrashtructure.Enums;
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

            //Account
            modelBuilder.Entity<Account>()
                .HasKey(a => a.AccountID);
            modelBuilder.Entity<Account>()
                .Property(a => a.UserName)
                .IsRequired()
                .HasMaxLength(30);
            modelBuilder.Entity<Account>()
                .Property(a => a.ReceiveEmail)
                .HasAnnotation("EmailAddress", true);
            modelBuilder.Entity<Account>()
                .HasOne(a => a.Role)
                .WithMany()
                .HasForeignKey(a => a.RoleID)
                .IsRequired();

            modelBuilder.Entity<Account>()
                .HasOne(a => a.Coder)
                .WithOne(c => c.Account)
                .HasForeignKey<Coder>(c => c.CoderID);

            modelBuilder.Entity<Account>()
                .Ignore(a => a.SaltMD5)
                .Ignore(a => a.PwdResetCode)
                .Ignore(a => a.PwdResetDate)
                .Ignore(a => a.Password);

            //announcement
            modelBuilder.Entity<Announcement>()
                .HasKey(a => a.AnnouncementID);
            modelBuilder.Entity<Announcement>()
                .HasOne(a => a.Contest)
                .WithMany(c => c.Announcements)
                .HasForeignKey(a => a.ContestID)
                .IsRequired();
            modelBuilder.Entity<Announcement>()
                .Property(a => a.AnnounceContent)
                .IsRequired();

            //Blog
            modelBuilder.Entity<Blog>()
                .HasKey(b => b.BlogID);

            modelBuilder.Entity<Blog>()
                .Property(b => b.Title)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Blog>()
                .Property(b => b.Content)
                .IsRequired();

            modelBuilder.Entity<Blog>()
                .Property(b => b.Published)
                .HasDefaultValue(0);

            modelBuilder.Entity<Blog>()
                .Property(b => b.PinHome)
                .HasDefaultValue(0);

            modelBuilder.Entity<Blog>()
                .HasOne(b => b.Coder)
                .WithMany(c => c.Blogs)
                .HasForeignKey(b => b.CoderID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Blog>()
                .HasMany(b => b.Comments)
                .WithOne(c => c.Blog)
                .HasForeignKey(c => c.BlogID)
                .OnDelete(DeleteBehavior.Cascade);
            
            //comment
            modelBuilder.Entity<Comment>()
                .HasKey(c => c.CommentID);

            modelBuilder.Entity<Comment>()
                .Property(c => c.Content)
                .IsRequired();

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Blog)
                .WithMany(b => b.Comments)
                .HasForeignKey(c => c.BlogID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Coder)
                .WithMany()
                .HasForeignKey(c => c.CoderID)
                .OnDelete(DeleteBehavior.Cascade);

            //compiler
            modelBuilder.Entity<Compiler>(entity =>
            {
                entity.HasKey(c => c.CompilerID);

                entity.Property(c => c.CompilerName)
                      .IsRequired()
                      .HasMaxLength(20);

                entity.Property(c => c.CompilerPath)
                      .IsRequired();

                entity.Property(c => c.CompilerOption)
                      .IsRequired();

                entity.Property(c => c.CompilerExtension)
                      .HasMaxLength(10);

                entity.HasMany(c => c.Submissions)
                      .WithOne()
                      .HasForeignKey(s => s.CompilerID);

                entity.HasMany(c => c.Problems)
                      .WithOne()
                      .HasForeignKey(p => p.TestCompilerID);
            });
            //category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.CategoryID);

                entity.Property(c => c.CatName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(c => c.CatOrder)
                      .IsRequired();

                entity.HasMany(c => c.ProblemCategories)
                      .WithOne()
                      .HasForeignKey(pc => pc.CategoryID);
            });

            //coder
            modelBuilder.Entity<Coder>(entity =>
            {
                entity.HasKey(c => c.CoderID);

                entity.Property(c => c.CoderName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(c => c.CoderEmail)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(c => c.PhoneNumber)
                      .HasMaxLength(10);

                entity.Property(c => c.Avatar)
                      .HasMaxLength(255);

                entity.Property(c => c.Description)
                      .HasMaxLength(100);

                entity.Property(c => c.CreatedAt)
                      .IsRequired()
                      .HasColumnType("datetime");

                entity.Property(c => c.CreatedBy)
                      .HasMaxLength(100);

                entity.Property(c => c.UpdatedAt)
                      .HasColumnType("datetime");

                entity.Property(c => c.UpdatedBy)
                      .HasMaxLength(100);

                entity.HasOne(c => c.Account)
                      .WithOne()
                      .HasForeignKey<Coder>(c => c.CoderID);

                entity.HasMany(c => c.Blogs)
                      .WithOne(b => b.Coder)
                      .HasForeignKey(b => b.CoderID);

                entity.HasMany(c => c.Comments)
                      .WithOne(c => c.Coder)
                      .HasForeignKey(c => c.CoderID);

                entity.HasMany(c => c.Submissions)
                      .WithOne(s => s.Coder)
                      .HasForeignKey(s => s.CoderID);

                entity.HasMany(c => c.Solveds)
                      .WithOne(s => s.Coder)
                      .HasForeignKey(s => s.CoderID);

                entity.HasMany(c => c.Problems)
                      .WithOne(p => p.Coder)
                      .HasForeignKey(p => p.CoderID);

                entity.HasMany(c => c.Contests)
                       .WithOne(co => co.Coder)
                       .HasForeignKey(co => co.CoderID)
                       .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(c => c.Favourites)
                      .WithOne(f => f.Coder)
                      .HasForeignKey(f => f.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(c => c.Participations)
                      .WithOne(p => p.Coder)
                      .HasForeignKey(p => p.CoderID);
            });

            //contest
            modelBuilder.Entity<Contest>(entity =>
            {
                entity.HasKey(c => c.ContestID);

                entity.Property(c => c.ContestName)
                      .IsRequired();

                entity.Property(c => c.StartTime)
                      .IsRequired()
                      .HasColumnType("datetime");

                entity.Property(c => c.EndTime)
                      .IsRequired()
                      .HasColumnType("datetime");

                entity.Property(c => c.RuleType)
                      .HasMaxLength(255);

                entity.Property(c => c.FailedPenalty)
                      .HasMaxLength(255);

                entity.Property(c => c.Published)
                      .HasDefaultValue(0);

                entity.Property(c => c.Status)
                      .HasDefaultValue(0);

                entity.Property(c => c.Duration)
                      .IsRequired();

                entity.Property(c => c.RankingFinished)
                      .HasMaxLength(255);

                entity.Property(c => c.FrozenTime)
                      .HasColumnType("int");

                entity.HasOne(c => c.Coder)
                      .WithMany(c =>c.Contests)
                      .HasForeignKey(c => c.CoderID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(c => c.Participations)
                      .WithOne(p => p.Contest)
                      .HasForeignKey(p => p.ContestID);

                entity.HasMany(c => c.HasProblems)
                      .WithOne(hp => hp.Contest)
                      .HasForeignKey(hp => hp.ContestID);

                entity.HasMany(c => c.Announcements)
                      .WithOne(a => a.Contest)
                      .HasForeignKey(a => a.ContestID);
            });

            //favourite
            modelBuilder.Entity<Favourite>(entity =>
            {
                entity.HasKey(f => new { f.CoderID, f.ProblemID });

                entity.Property(f => f.Note)
                      .HasMaxLength(50);

                entity.HasOne(f => f.Coder)
                      .WithMany(c=> c.Favourites)
                      .HasForeignKey(f => f.CoderID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(f => f.Problem)
                      .WithMany()
                      .HasForeignKey(f => f.ProblemID)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            //hasProblem
            modelBuilder.Entity<HasProblem>()
                .HasKey(hp => hp.HasProblemID);

            modelBuilder.Entity<HasProblem>()
                .HasOne(hp => hp.Contest)
                .WithMany(c => c.HasProblems)
                .HasForeignKey(hp => hp.ContestID)
                .IsRequired();

            modelBuilder.Entity<HasProblem>()
                .HasOne(hp => hp.Problem)
                .WithMany(p => p.HasProblems)
                .HasForeignKey(hp => hp.ProblemID)
                .IsRequired();

            modelBuilder.Entity<HasProblem>()
                .Property(hp => hp.ProblemOrder)
                .IsRequired();

            modelBuilder.Entity<HasProblem>()
                .Property(hp => hp.Point)
                .IsRequired();
            //participation
            modelBuilder.Entity<Participation>()
                .HasKey(p => p.ParticipationID);

            modelBuilder.Entity<Participation>()
                .HasOne(p => p.Coder)
                .WithMany(c => c.Participations)
                .HasForeignKey(p => p.CoderID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Participation>()
                .HasOne(p => p.Contest)
                .WithMany(c => c.Participations)
                .HasForeignKey(p => p.ContestID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Participation>()
                .HasMany(p => p.TakeParts)
                .WithOne(tp => tp.Participation)
                .HasForeignKey(tp => tp.ParticipationID)
                .OnDelete(DeleteBehavior.Cascade);
            //problem
            modelBuilder.Entity<Problem>()
        .HasKey(p => p.ProblemID);

            modelBuilder.Entity<Problem>()
                .HasOne(p => p.Coder)
                .WithMany(c => c.Problems)
                .HasForeignKey(p => p.CoderID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Problem>()
                .HasOne(p => p.Compiler)
                .WithMany(c => c.Problems)
                .HasForeignKey(p => p.TestCompilerID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Problem>()
                .HasMany(p => p.TestCases)
                .WithOne(tc => tc.Problem)
                .HasForeignKey(tc => tc.ProblemID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Problem>()
                .HasMany(p => p.Solveds)
                .WithOne(s => s.Problem)
                .HasForeignKey(s => s.ProblemID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Problem>()
                .HasMany(p => p.ProblemCategories)
                .WithOne(pc => pc.Problem)
                .HasForeignKey(pc => pc.ProblemID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Problem>()
                .HasMany(p => p.Submissions)
                .WithOne(s => s.Problem)
                .HasForeignKey(s => s.ProblemID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Problem>()
                .HasMany(p => p.TakeParts)
                .WithOne(tp => tp.Problem)
                .HasForeignKey(tp => tp.ProblemID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Problem>()
                .HasMany(p => p.Favourites)
                .WithOne(f => f.Problem)
                .HasForeignKey(f => f.ProblemID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Problem>()
                .HasMany(p => p.HasProblems)
                .WithOne(hp => hp.Problem)
                .HasForeignKey(hp => hp.ProblemID)
                .OnDelete(DeleteBehavior.Cascade);

            //problemcategory
            modelBuilder.Entity<ProblemCategory>()
                    .HasKey(pc => new { pc.ProblemID, pc.CategoryID });

            modelBuilder.Entity<ProblemCategory>()
                .HasOne(pc => pc.Problem)
                .WithMany(p => p.ProblemCategories)
                .HasForeignKey(pc => pc.ProblemID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProblemCategory>()
                .HasOne(pc => pc.Category)
                .WithMany(c => c.ProblemCategories)
                .HasForeignKey(pc => pc.CategoryID)
                .OnDelete(DeleteBehavior.Cascade);
            //role
            modelBuilder.Entity<Role>()
                .HasKey(r => r.RoleID);
            modelBuilder.Entity<Role>()
                .HasMany(r => r.Accounts)
                .WithOne(a => a.Role)
                .HasForeignKey(a => a.RoleID)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Role>().HasData(
            Enum.GetValues(typeof(RoleEnum))
                .Cast<RoleEnum>()
                .Select(e => new Role
                {
                    RoleID = (int)e,
                    Name = e.ToString()
                })
            );

            //solved
            modelBuilder.Entity<Solved>()
                .HasKey(s => new { s.CoderID, s.ProblemID });

            modelBuilder.Entity<Solved>()
                .HasOne(s => s.Coder)
                .WithMany(c => c.Solveds)
                .HasForeignKey(s => s.CoderID);

            modelBuilder.Entity<Solved>()
                .HasOne(s => s.Problem)
                .WithMany(p => p.Solveds)
                .HasForeignKey(s => s.ProblemID);
            //submission
            modelBuilder.Entity<Submission>()
        .HasKey(s => s.SubmissionID);

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Coder)
                .WithMany(c => c.Submissions)
                .HasForeignKey(s => s.CoderID);

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Compiler)
                .WithMany(c => c.Submissions)
                .HasForeignKey(s => s.CompilerID);

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Problem)
                .WithMany(p => p.Submissions)
                .HasForeignKey(s => s.ProblemID);

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.TakePart)
                .WithMany(t => t.Submissions)
                .HasForeignKey(s => s.TakePartID);

            modelBuilder.Entity<Submission>()
                .HasMany(s => s.TestRuns)
                .WithOne(t => t.Submission)
                .HasForeignKey(t => t.SubmissionID);

            //takepart
            modelBuilder.Entity<TakePart>()
                .HasKey(tp => tp.TakePartID);

            modelBuilder.Entity<TakePart>()
                .HasOne(tp => tp.Participation)
                .WithMany(p => p.TakeParts)
                .HasForeignKey(tp => tp.ParticipationID);

            modelBuilder.Entity<TakePart>()
                .HasOne(tp => tp.Problem)
                .WithMany(p => p.TakeParts)
                .HasForeignKey(tp => tp.ProblemID);

            modelBuilder.Entity<TakePart>()
                .HasMany(tp => tp.Submissions)
                .WithOne(s => s.TakePart)
                .HasForeignKey(s => s.TakePartID);
            //testcase
            modelBuilder.Entity<TestCase>()
        .       HasKey(tc => tc.TestCaseID);

            modelBuilder.Entity<TestCase>()
                .HasOne(tc => tc.Problem)
                .WithMany(p => p.TestCases)
                .HasForeignKey(tc => tc.ProblemID);

            modelBuilder.Entity<TestCase>()
                .HasMany(tc => tc.TestRuns)
                .WithOne(tr => tr.TestCase)
                .HasForeignKey(tr => tr.TestCaseID);

            //test run
            modelBuilder.Entity<TestRun>()
        .HasKey(tr => tr.TestRunID);

            modelBuilder.Entity<TestRun>()
                .HasOne(tr => tr.Submission)
                .WithMany(s => s.TestRuns)
                .HasForeignKey(tr => tr.SubmissionID);

            modelBuilder.Entity<TestRun>()
                .HasOne(tr => tr.TestCase)
                .WithMany(tc => tc.TestRuns)
                .HasForeignKey(tr => tr.TestCaseID);
        }

    }
}
