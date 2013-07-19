using HotshotJsSample.Domain.Entities;
using HotshotJsSample.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Mock.MockRepository
{
    public class MockItemRepository : IRepository<Item>
    {

        public Item Get(Guid Id)
        {
            return MockDataGenerator.MockItems.First();
        }

        public IEnumerable<Item> GetAll()
        {
            return MockDataGenerator.MockItems;
        }

        public Item Add(Item model)
        {
            return MockDataGenerator.MockItems.First();
        }

        public Item Update(Guid Id, Item model)
        {
            return MockDataGenerator.MockItems.First();
        }

        public void Delete(Guid Id)
        {
            //Deleted, But how does it matter, this method is fake!
        }


        public Item Get(Func<Item, bool> where)
        {
            return MockDataGenerator.MockItems.SingleOrDefault(where);
        }

        public IEnumerable<Item> GetMany(Func<Item, bool> where)
        {
            return MockDataGenerator.MockItems.Where(where);
        }
    }
}
