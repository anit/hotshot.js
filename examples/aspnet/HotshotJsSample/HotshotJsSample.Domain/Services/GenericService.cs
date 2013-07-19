using HotshotJsSample.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Domain.Services
{
    public class GenericService<T>: IService<T>
    {
        private IRepository<T> Repository;

        public GenericService(IRepository<T> repository)
        {
            this.Repository = repository;
        }

        public IEnumerable<T> GetAll()
        {
            return Repository.GetAll();
        }

        public T Get(Guid ID)
        {
            return Repository.Get(ID);
        }

        public T Add(T model)
        {
            return Repository.Add(model);
        }

        public T Update(Guid ID, T model)
        {
            return Repository.Update(ID, model);
        }

        public void Delete(Guid Id)
        {
            Repository.Delete(Id);
        }
    }
}
