namespace ntucoderbe.Models.ERD
{
    public class Role
    {
        public int RoleID { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Account> Accounts { get; set; } = new HashSet<Account>();
    }

}
