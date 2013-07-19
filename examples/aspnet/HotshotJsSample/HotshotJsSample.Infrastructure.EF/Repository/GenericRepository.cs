using HotshotJsSample.Domain.Repository;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Infrastructure.EF.Repository
{
    public class GenericRepository<TEntity> : IRepository<TEntity> where TEntity: class
    {
        protected DbContext Context { get; private set; }
        protected DbSet<TEntity> DbSet{ get; set; }
        protected IQueryable<TEntity> QuerySet { get { return DbSet; } }

        private readonly ConcurrentDictionary<Type, object> _dbSets =
                    new ConcurrentDictionary<Type, object>();


        protected GenericRepository()
        {
            this.DbSet = Context.Set<TEntity>();
        }


        public TEntity Get(Guid Id)
        {
            return (TEntity)DbSet.Find(Id);
        }

        public TEntity Get(Func<TEntity, bool> where)
        {
            return (TEntity)QuerySet.Where(where);
        }

        public IEnumerable<TEntity> GetMany(Func<TEntity, bool> where)
        {
            return QuerySet.Where(where);
        }

        public IEnumerable<TEntity> GetAll()
        {
            return QuerySet.AsEnumerable();
        }

        public TEntity Add(TEntity model)
        {
            return (TEntity)DbSet.Add(model);
        }

        public TEntity Update(Guid Id, TEntity model)
        {
            TEntity entity = (TEntity)DbSet.Find(Id);
            Context.Entry(entity).CurrentValues.SetValues(model);
            return entity;
        }

        public void Delete(Guid Id)
        {
            TEntity entity = (TEntity)DbSet.Find(Id);
            DbSet.Remove(entity);
        }
    }
}
