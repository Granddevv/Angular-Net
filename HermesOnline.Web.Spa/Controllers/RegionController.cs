using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Dtos.Node;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/Region")]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class RegionController : ApiController
    {
        #region Fields

        private IRegionService _regionService;
        private readonly IMapper _mapper;
        private ISiteService _siteService;

        #endregion

        #region C'tor

        public RegionController(IRegionService regionService, ISiteService siteService, IMapper mapper)
        {
            _regionService = regionService;
            _mapper = mapper;
            _siteService = siteService;
        }
        #endregion

        #region Api

        [Route("")]
        [HttpGet]
        public IEnumerable<RegionDto> GetRegions()
        {
            return _mapper.Map<IEnumerable<RegionDto>>(_regionService.GetAll().OrderBy(x => x.Name).ToList());
        }

        [Route("Site/{siteId?}")]
        [HttpGet]
        public IdValue GetRegion(Guid siteId)
        {
            return _mapper.Map<IdValue>(_siteService.GetById(siteId).Country.Region);
        }
        #endregion
    }
}
