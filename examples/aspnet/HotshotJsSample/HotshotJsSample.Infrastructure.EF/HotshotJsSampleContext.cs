using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using HotshotJsSample.Domain.Entities;
using HotshotJsSample.Infrastructure.EF.Mappings;

namespace HotshotJsSample.Infrastructure.EF
{
    public class HotshotJsSampleContext : DbContext, IUnitOfWork
    {
        public DbSet<Person> People { get; set; }
        public DbSet<Item> Items { get; set; }

        public virtual void Commit()
        {
            base.SaveChanges();
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Configurations.Add(new PersonMapping());
            
        }
    }
}
