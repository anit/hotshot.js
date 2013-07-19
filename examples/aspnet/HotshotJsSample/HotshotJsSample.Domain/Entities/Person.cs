using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Domain.Entities
{
    public class Person
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public ICollection<Item> ItemsPurchased { get; set; }
    }
}
