using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Service;
using HermesOnline.Service.Interfaces;
using HermesOnline.Domain;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Node")]
    public class NodeController : BaseController
    {
        private readonly IUserManager _userManager;
        private readonly IMapper _mapper;
        private readonly IFleetService _fleetService;
        private readonly ITurbineService _turbineService;
        private readonly IInspectionService _inspectionService;

        public NodeController(IUserManager userManager, IMapper mapper, IFleetService fleetService, IInspectionService inspectionService, ITurbineService turbineService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _fleetService = fleetService;
            _inspectionService = inspectionService;
            _turbineService = turbineService;
        }

        [HttpGet]
        [Route("Fleets")]
        public IEnumerable<IdText> GetFleets()
        {
            var result = _mapper.Map<IEnumerable<IdText>>(_fleetService.GetAllFleets());

            return result.OrderBy(x => x.Text);
        }

        [HttpGet]
        [Route("Inspections/{turbineId?}")]
        public IEnumerable<IdText> GetInspections(Guid turbineId)
        {
            var result = _mapper.Map<IEnumerable<IdText>>(_inspectionService.GetInspectionsForNode(turbineId, NodeType.Turbine));

            return result.OrderBy(x => x.Text);
        }

        [Route("DeleteTurbine/{turbineId}")]
        [HttpDelete]
        public IHttpActionResult DeleteTurbine(string turbineId)
        {
            var serviceResult = _turbineService.DeleteTurbine(new Guid(turbineId));

            return CreateHttpActionResult(serviceResult);
        }


        [Route("DeleteInspection/{turbineId}/{inspectionId}")]
        [HttpDelete]
        public IHttpActionResult DeleteInspection(string turbineId, string inspectionId)
        {
            var serviceResult = _inspectionService.DeleteInspection(new Guid(turbineId), new Guid(inspectionId));

            return CreateHttpActionResult(serviceResult);
        }
    }
}


