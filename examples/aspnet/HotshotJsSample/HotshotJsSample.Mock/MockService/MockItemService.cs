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
    public class MockItemService : IService<Item> 
    {

        private IRepository<Item> ItemRepository;
       
        public MockItemService(IRepository<Item> itemRepository)
        {
            this.ItemRepository = itemRepository;
        }

        public IEnumerable<Item> GetAll()
        {
            return this.ItemRepository.GetAll();
        }

        public Item Get(Guid ID)
        {
           return  this.ItemRepository.Get(ID);
        }

        public Item Add(Item model)
        {
            return this.ItemRepository.Add(model);
        }

        public Item Update(Guid ID, Item model)
        {
            return this.ItemRepository.Update(ID, model);
        }

        public void Delete(Guid Id)
        {
            this.ItemRepository.Delete(Id);
        }
    }
}
