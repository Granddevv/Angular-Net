using System.Web.Http;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Interfaces;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.DeletedItems;
using HermesOnline.Web.Spa.Filters;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/DeletedItems")]
    [Authorize]
    [AuthorizationUser(Permission.AdminNavigation)]
    public class DeletedItemsController : BaseController
    {
        private readonly ISiteService _siteService;
        private readonly IBladeService _bladeService;
        private readonly ITurbineService _turbineService;
        private readonly IReportService _reportService;
        private readonly IDefectApiService _defectService;
        private readonly IImageApiService _imageService;

        public DeletedItemsController(ISiteService siteService, IBladeService bladeService, IReportService reportService,
           IDefectApiService defectService, IImageApiService imageService,ITurbineService turbineService)
        {
            _siteService = siteService;
            _bladeService = bladeService;
            _reportService = reportService;
            _defectService = defectService;
            _imageService = imageService;
            _turbineService = turbineService;
        }

        [Route("")]
        [HttpGet]
        public DeletedItemsDto GetAll()
        {
            return new DeletedItemsDto
            {
                NumOfSites = _siteService.DeletedCount().ToString(),
                NumOfTurbines = _turbineService.DeletedCount().ToString(),
                NumOfBlades = _bladeService.DeletedCount().ToString(),
                NumOfFindings = _defectService.DeletedCount().ToString(),
                NumOfImages = _imageService.DeletedCount().ToString(),
                NumOfReports = _reportService.DeletedCount().ToString()
            };
        }
    }
}
