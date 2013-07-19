using HotshotJsSample.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Infrastructure.EF.Mappings
{
    public class PersonMapping : EntityTypeConfiguration<Person>
    {
        public PersonMapping()
        {
            HasMany(e => e.ItemsPurchased).WithRequired().WillCascadeOnDelete(true);
        }
    }
}
