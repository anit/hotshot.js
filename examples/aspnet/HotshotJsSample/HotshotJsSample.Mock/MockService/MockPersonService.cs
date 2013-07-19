using HotshotJsSample.Domain.Entities;
using HotshotJsSample.Domain.Repository;
using HotshotJsSample.Domain.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Mock.MockService
{
    public class MockPersonService : IService<Person>
    {
        IRepository<Person> PersonRepository;

        public MockPersonService(IRepository<Person> personRepository)
        {
            this.PersonRepository = personRepository;
        }

        public IEnumerable<Person> GetAll()
        {
            return this.PersonRepository.GetAll();
        }

        public Person Get(Guid ID)
        {
            return this.PersonRepository.Get(ID);
        }

        public Person Add(Person model)
        {
            return this.PersonRepository.Add(model);
        }

        public Person Update(Guid ID, Person model)
        {
            return this.PersonRepository.Update(ID, model);
        }

        public void Delete(Guid Id)
        {
            this.PersonRepository.Delete(Id);
        }
    }
}
