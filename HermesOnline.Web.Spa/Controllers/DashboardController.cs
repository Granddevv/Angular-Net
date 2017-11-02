using System.Web.Http;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Interfaces;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.Dashboard;
using HermesOnline.Web.Spa.Filters;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Dashboard")]
    [Authorize]
    [AuthorizationUser(Permission.DashboardNavigation)]
    public class DashboardController : BaseController
    {
        private readonly ISiteService _siteService;
        private readonly IBladeService _bladeService;
        private readonly ITurbineService _turbineService;
        private readonly IReportService _reportService;
        private readonly IDefectApiService _defectService;
        private readonly IDeepZoomLinkService _deepZoomLinkService;

        public DashboardController(ISiteService siteService, IBladeService bladeService, IReportService reportService,
           IDefectApiService defectService, IDeepZoomLinkService deepZoomLinkService,ITurbineService turbineService)
        {
            _siteService = siteService;
            _bladeService = bladeService;
            _reportService = reportService;
            _defectService = defectService;
            _deepZoomLinkService = deepZoomLinkService;
            _turbineService = turbineService;

        }

        [Route("")]
        [HttpGet]
        public DashboardPreviewDto GetAll()
        {
            return new DashboardPreviewDto
            {
                NumOfSites = _siteService.Count().ToString(),
                NumOfTurbines = _turbineService.Count().ToString(),
                NumOfBlades = _bladeService.Count().ToString(),
                NumOfDeepZoomLinks = _deepZoomLinkService.Count().ToString(),
                NumOfFindings = _defectService.Count().ToString(),
                NumOfReports = _reportService.Count().ToString()
            };
        }
    }
}
