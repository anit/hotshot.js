using Microsoft.Practices.Unity;
using Microsoft.Practices.ServiceLocation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HotshotJsSample.Domain.Services;
using HotshotJsSample.Domain.Entities;
using HotshotJsSample.Mock.MockService;
using HotshotJsSample.Mock.MockRepository;
using HotshotJsSample.Domain.Repository;

namespace HotshotJsSample
{
    public static class Injection
    {
        public static void Initialize()
        {
            var container = SetupInjections();

            var dependencyResolverAdapter = new Unity.Mvc3.ServiceLocator.UnityDependencyResolverAdapter(container);
            DependencyResolver.SetResolver(dependencyResolverAdapter);
            ServiceLocator.SetLocatorProvider(() => dependencyResolverAdapter);            
        }

        public static IUnityContainer SetupInjections()
        {
            var container = new UnityContainer();
            container.RegisterType<IService<Person>, MockPersonService>();
            container.RegisterType<IService<Item>, MockItemService>();

            container.RegisterType<IRepository<Person>, MockPersonRepository>();
            container.RegisterType<IRepository<Item>, MockItemRepository>();

            return container;
        }

    }
}
