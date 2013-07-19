using HotshotJsSample.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotshotJsSample.Mock
{
    public static class MockDataGenerator
    {

        public static IEnumerable<Person> MockPersons;
        public static IEnumerable<Item> MockItems;


        static MockDataGenerator()
        {
            MockItems = GetMockItems();
            MockPersons = GetMockPersons();
        }

        private static IEnumerable<Person> GetMockPersons()
        {
            for (int i = 0; i < 15; i++)
            {
                yield return new Person
                {
                    ID = Guid.NewGuid(),
                    Name = "Person" + i,
                    Address = "Address" + i,
                    ItemsPurchased = MockItems.ToList()
                };
            }
        }

        private static IEnumerable<Item> GetMockItems()
        {
            for (int i = 0; i < 5; i++)
            {
                yield return new Item
                {
                    ID = Guid.NewGuid(),
                    Name = "Item" + i,
                    Price = i*44.98876,
                    Quantity = i
                };
            }

        }

    }
}
