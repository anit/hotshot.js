using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Domain.Repository
{
    public interface IRepository<T>
    {
        T Get(Guid Id);
        T Get(Func<T, bool> where);
        IEnumerable<T> GetMany(Func<T, bool> where);
        IEnumerable<T> GetAll();

        T Add(T model);
        T Update(Guid Id, T model);
        void Delete(Guid Id);
    }
}
