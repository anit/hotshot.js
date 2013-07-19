using HotshotJsSample.Domain.Entities;
using HotshotJsSample.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Mock.MockRepository
{
    public class MockPersonRepository : IRepository<Person>
    {

        public Person Get(Guid Id)
        {
            return MockDataGenerator.MockPersons.First();
        }

        public IEnumerable<Person> GetAll()
        {
            return MockDataGenerator.MockPersons;
        }

        public Person Add(Person model)
        {
            return MockDataGenerator.MockPersons.First();
        }

        public Person Update(Guid Id, Person model)
        {
            return MockDataGenerator.MockPersons.First();
        }

        public void Delete(Guid Id)
        {
            //Deleted, But how does it matter, this method is fake!
        }

        public Person Get(Func<Person, bool> where)
        {
            return MockDataGenerator.MockPersons.SingleOrDefault(where);
        }

        public IEnumerable<Person> GetMany(Func<Person, bool> where)
        {
            return MockDataGenerator.MockPersons.Where(where);
        }
    }
}
