using Microsoft.AspNetCore.Mvc;

namespace WebSite.Controllers;

public class HomeController : Controller
{
    [HttpGet]
    public ActionResult Index()
    {
        return View();
    }
}