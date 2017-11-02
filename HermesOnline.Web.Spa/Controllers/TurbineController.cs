using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Interfaces;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Dtos.Node;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/Turbine")]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class TurbineController : ApiController
    {

        #region Fields

        private readonly ITurbineService _turbineService;
        private readonly IBladeService _bladeService;
        private readonly IMapper _mapper;
        #endregion

        #region C'tor

        public TurbineController(ITurbineService turbineService, IBladeService bladeService, IMapper mapper)
        {
            _turbineService = turbineService;
            _bladeService = bladeService;
            _mapper = mapper;
        }
        #endregion

        #region Api
        
        [Route("Search/{turbineName?}")]
        [HttpGet]
        public IEnumerable<IdValue> Search(string turbineName = "")
        {
            return _mapper.Map<IEnumerable<IdValue>>(_turbineService.GetTurbines(turbineName).OrderBy(x => x.Name));
        }

        [Route("Site/{siteId?}")]
        [HttpGet]
        public IEnumerable<TurbineDto> GetAllTurbinesBySiteId(Guid siteId)
        {
            IEnumerable<TurbineDto> turbines = _turbineService.GetForSiteId<TurbineDto>(siteId);
            return turbines.OrderByDescending(x => x.Severity).ThenBy(x => x.Value);
        }

        [Route("Name/{turbineId?}")]
        [HttpGet]
        public string Name(Guid turbineId)
        {
            return  _turbineService.GetById(turbineId).Name;
        }

        [Route("Blade/{bladeId?}")]
        [HttpGet]
        public IdValue GetTurbineByBladeId(Guid bladeId)
        {
            return _mapper.Map<IdValue>(_bladeService.GetBlade(bladeId).Turbine);
        }

        [Route("MaxNumOfDefect/{turbineId?}")]
        [HttpGet]
        public int GetMaxNumOfDefectsPerBlades(Guid turbineId)
        {
           return _turbineService.GetMaxNumOfDefects(turbineId);
        }

        [Route("BladeLength/{turbineId?}")]
        [HttpGet]
        public decimal GetTurbineBladeLength(Guid turbineId)
        {
            var turbine = _turbineService.GetById(turbineId);

            if(turbine == null)
            {
                throw new Exception($"Turbine with turbineId { turbineId } does not exist.");
            }

            return turbine.Blades.First().Length;
        }

        [Route("getTurbineBySiteId/{siteId}")]
        [HttpGet]
        public IEnumerable<IdText> GetTurbineBySiteId(Guid siteId)
        {
            var data = _mapper.Map<IEnumerable<IdText>>(_turbineService.GetAllTurbinesBySiteId(siteId));

            return data.OrderBy(x => x.Text);
        }

        [Route("getTurbineForBlade/{bladeId}")]
        [HttpGet]
        public IdText GetTurbineForBlade(Guid bladeId)
        {
            var turbineId = _bladeService.GetBlade(bladeId).TurbineId;
            var result = _mapper.Map<IdText>(_turbineService.GetById(turbineId));

            return result;
        }
        #endregion
    }
}
