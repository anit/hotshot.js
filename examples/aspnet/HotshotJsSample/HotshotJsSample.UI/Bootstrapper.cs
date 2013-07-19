using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Unity.Mvc3;
using HotshotJsSample.Domain.Services;
using HotshotJsSample.Domain.Entities;
using HotshotJsSample.Mock.MockService;
using HotshotJsSample.Mock.MockRepository;
using HotshotJsSample.Domain.Repository;
using HotshotJsSample.Infrastructure.EF.Repository;
using System.Data.Entity;
using HotshotJsSample.Infrastructure.EF;

namespace HotshotJsSample
{
    public static class Bootstrapper
    {
        public static void Initialise()
        {
            var container = BuildUnityContainer();

            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
        }

        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            container.RegisterType<IService<Person>, GenericService<Person>>();
            container.RegisterType<IService<Item>, GenericService<Item>>();

            container.RegisterType<IRepository<Person>, GenericRepository<Person>>();
            container.RegisterType<IRepository<Item>, GenericRepository<Item>>();

            container.RegisterType<DbContext, HotshotJsSampleContext>();
            container.RegisterType<IUnitOfWork, HotshotJsSampleContext>();

            return container;
        }
    }
}