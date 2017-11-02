using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Interfaces;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Dtos.Node;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/Site")]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class SiteController : ApiController
    {
        #region Fields

        private readonly ISiteService _siteService;
        private readonly ITurbineService _turbineService;
        private readonly IMapper _mapper;
        private IBladeService _bladeService;

        #endregion

        #region C'tor

        public SiteController(ISiteService siteService, ITurbineService turbineService, IBladeService bladeService, IMapper mapper)
        {
            _siteService = siteService;
            _mapper = mapper;
            _turbineService = turbineService;
            _bladeService = bladeService;
        }
        #endregion

        #region Api

        [Route("Search/{siteName?}")]
        [HttpGet]
        public IEnumerable<IdValue> Search(string siteName = "")
        {
            return _mapper.Map<IEnumerable<IdValue>>(_siteService.GetSites(siteName).Where(x => x.Turbines.Any(t => !t.IsDeleted)).OrderBy(x => x.Name)).ToList();
        }

        [Route("Name/{siteId?}")]
        [HttpGet]
        public string Name(Guid siteId)
        {
            Site site = _siteService.GetById(siteId);
            return site.Name;
        }

        [Route("NumberOfTurbines/{siteId?}")]
        [HttpGet]
        public int NumberOfTurbines(Guid siteId)
        {
            return _turbineService.GetAllTurbinesBySiteId(siteId).Count();
        }

        [Route("{turbineId?}")]
        [HttpGet]
        public IdValue Site(Guid turbineId)
        {
            return _mapper.Map<IdValue>(_turbineService.GetById(turbineId).Site);
        }

        [Route("Blade/{bladeId?}")]
        [HttpGet]
        public IdValue GetSiteByBladeId(Guid bladeId)
        {
            return _mapper.Map<IdValue>(_bladeService.GetBlade(bladeId).Turbine.Site);
        }

        [Route("Country/{countryId?}")]
        [HttpGet]
        public IEnumerable<SiteDto> GetSiteByCountryId(Guid countryId)
        {
            return _siteService.GetForCountryId<SiteDto>(countryId);
        }

        [Route("getSite")]
        [HttpGet]
        public IEnumerable<IdText> GetSite()
        {
            var result = _mapper.Map<IEnumerable<IdText>>(_siteService.GetAll());

            return result.OrderBy(x => x.Text);
        }

        [Route("getSiteForTurbine/{turbineId?}")]
        [HttpGet]
        public IdText GetSiteForTurbine(Guid turbineId)
        {
            var siteId = _turbineService.GetById(turbineId).SiteId;
            var result = _mapper.Map<IdText>(_siteService.GetById(siteId));
          
            return result;
        }

        [HttpGet]
        [Route("Sites/{fleetId?}")]
        public IEnumerable<IdText> GetSites(Guid fleetId)
        {
            var result = _mapper.Map<IEnumerable<IdText>>(_siteService.GetAllSitesByFleetId(fleetId));

            return result.OrderBy(x => x.Text);
        }
        #endregion
    }
}
