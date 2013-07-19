using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Infrastructure.EF
{
    public interface IUnitOfWork
    {
        void Commit();
    }
}
