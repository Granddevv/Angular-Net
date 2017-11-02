using System.Linq;
using System.Reflection;
using System.Web.Http;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Application")]
    [Authorize]
    public class ApplicationController : ApiController
    {
        [Route("Version")]
        [HttpGet]
        public string GetVersion()
        {
            return typeof(ApplicationController).Assembly.GetCustomAttributes(inherit: false)
           .OfType<AssemblyFileVersionAttribute>()
           .Single().Version;
        }
    }
}
