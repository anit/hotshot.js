using HotshotJsSample.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Domain.Services
{
    public interface IService<T>
    {
        IEnumerable<T> GetAll();
        T Get(Guid ID);

        T Add(T model);
        T Update(Guid ID, T model);
        void Delete(Guid Id);

    }
}
