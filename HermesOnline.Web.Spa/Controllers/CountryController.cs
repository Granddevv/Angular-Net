using System;
using System.Collections.Generic;
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
    [RoutePrefix("Api/Country")]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class CountryController : ApiController
    {
        private readonly ICountryService _countryService;
        private readonly IMapper _mapper;
        private readonly ISiteService _siteService;

        public CountryController(ICountryService countryService, ISiteService siteService, IMapper mapper)
        {
            _countryService = countryService;
            _mapper = mapper;
            _siteService = siteService;
        }

        [Route("{regionId?}")]
        [HttpGet]
        public IEnumerable<CountryDto> GetCountries(Guid regionId)
        {
            return _countryService.GetForRegionId<CountryDto>(regionId);
        }

        [Route("Site/{siteId?}")]
        [HttpGet]
        public IdValue GetCountry(Guid siteId)
        {
            return _mapper.Map<IdValue>(_siteService.GetById(siteId).Country);
        }
    }
}
