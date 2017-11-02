using System;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Interfaces;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.Breadcrumb;
using HermesOnline.Web.Spa.Filters;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Breadcrumb")]
    public class BreadcrumbController : BaseController
    {
        private readonly IBladeService _bladeService;
        private readonly IDefectApiService _defectService;
        private readonly IMapper _mapper;
        private readonly ISiteService _siteService;
        private readonly ITurbineService _turbineService;

        public BreadcrumbController(IDefectApiService defectApiService, ISiteService siteService,
            ITurbineService turbineService, IBladeService bladeService, IMapper mapper)
        {
            _siteService = siteService;
            _turbineService = turbineService;
            _bladeService = bladeService;
            _defectService = defectApiService;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("Site/{siteId}")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public SiteBreadcrumbDto GetSiteFindingBreadcrumb(Guid siteId)
        {
            Site site = _siteService.GetById(siteId);
            return _mapper.Map<SiteBreadcrumbDto>(site);
        }

        [HttpGet]
        [Route("Turbine/{turbineId}")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public TurbineBreadcrumbDto GetTurbineBreadcrumb(Guid turbineId)
        {
            Turbine turbine = _turbineService.GetById(turbineId);
            return _mapper.Map<TurbineBreadcrumbDto>(turbine);
        }

        [HttpGet]
        [Route("Blade/{bladeId}")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public BladeBreadcrumbDto GetBladeBreadcrumb(Guid bladeId)
        {
            Blade blade = _bladeService.GetBlade(bladeId);
            return _mapper.Map<BladeBreadcrumbDto>(blade);
        }

        [HttpGet]
        [Route("Finding/{findingId}")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public BreadcrumbDto GetFindingBreadcrumb(Guid findingId)
        {
            Defect finding = _defectService.FindById(findingId);
            return _mapper.Map<DefectBreadcrumbDto>(finding);
        }
    }
}