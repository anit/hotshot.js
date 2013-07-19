using HotshotJsSample.Domain.Entities;
using HotshotJsSample.Domain.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HotshotJsSample.Controllers
{
    public class PersonController : Controller
    {
        //
        // GET: /Person/
        private IService<Person> PersonService;

        public PersonController(IService<Person> personService)
        {
            this.PersonService = personService;
        }

        public ActionResult Index()
        {
            IEnumerable<Person> viewModel = this.PersonService.GetAll();
            return View(viewModel);
        }

        public ActionResult Edit(Guid id)
        {
            Person person = this.PersonService.Get(id);
            return View(person);
        }

        [HttpPost]
        public ActionResult Edit(Person person)
        {
            Person model = this.PersonService.Update(person.ID, person);
            return View("Summary", person);
        }
    }
}
