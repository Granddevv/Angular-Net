using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Aether.Utils.ScreenCapture;
using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Domain;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.Findings;
using HermesOnline.Web.Spa.Filters;
using Defect = HermesOnline.Domain.Defect;
using HermesOnline.Web.Spa.Dtos.Blades;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/Blade")]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class BladeController : ApiController
    {
        #region Fields

        private readonly IBladeService _bladeService;
        private readonly IDefectApiService _defectApiService;
        private readonly IMapper _mapper;
        #endregion

        #region C'tor

        public BladeController(IBladeService bladeService, IDefectApiService defectApiService, IMapper mapper)
        {
            _defectApiService = defectApiService;
            _bladeService = bladeService;
            _mapper = mapper;
        }
        #endregion

        #region Api

        [Route("Search/{search?}")]
        [HttpGet]
        public IEnumerable<IdValue> Search(string search = "")
        {
            return _mapper.Map<IEnumerable<IdValue>>(_bladeService.GetBlades(search).OrderBy(x => x.Name)).ToList();
        }

        [Route("Name/{bladeId?}")]
        [HttpGet]
        public string Name(Guid bladeId)
        {
            return _bladeService.GetBlade(bladeId).SerialNumber;
        }

        [Route("Overview/{turbineId?}/{position}")]
        [HttpPost]
        public BladeOverviewDto Overview(Guid turbineId, BladePosition position, FindingsDataTableFilterModelDto findingsDataTableFilter)
        {
            FindingsQuery query = _mapper.Map<FindingsQuery>(findingsDataTableFilter);
            Blade blade = _bladeService.GetBlade(turbineId, position); 
            IQueryable<Defect> defects = _defectApiService.GetDefectsForNode(NodeType.Blade, blade.Id, query);      
            BladeOverviewDto overviewDto = new BladeOverviewDto
            {
                Id = blade.Id.ToString(),
                Value = $"{blade.Position} - {blade.SerialNumber}"
            };

            AssignNumberOfDefectsPerSeverity(defects, overviewDto);

            return overviewDto;
        }

        [Route("Surface/Overview/{bladeId?}/{surface}")]
        [HttpGet]
        public BladeOverviewDto GetSurfaceOverview(Guid bladeId, Surface surface)
        {
            var blade = _bladeService.GetBlade(bladeId);
            var defects = _defectApiService.GetDefectsForNode(bladeId, NodeType.Blade).Where(x => x.Surface == surface);

            // TODO Let AutoMapper do mapping for you. Create BladeOverviewDtoProfile with mappings
            var overviewDto = new BladeOverviewDto
            {
                Id = blade.Id.ToString(),
                Value = blade.SerialNumber
            };

            AssignNumberOfDefectsPerSeverity(defects, overviewDto);

            return overviewDto;
        }

        [Route("Length/{bladeId?}")]
        [HttpGet]
        public decimal GetBladeLength(Guid bladeId)
        {
            Blade blade = _bladeService.GetBlade(bladeId);            
            return blade.Length;
        }

        [Route("MaxNumOfDefect/{bladeId?}")]
        [HttpGet]
        public int GetMaxNumOfDefectsPerSides(Guid bladeId)
        {
            return _bladeService.GetMaxNumOfDefects(bladeId);
        }

        [Route("getBladeByTurbineId/{turbineId?}")]
        [HttpGet]
        public IEnumerable<IdText> GetBladeByTurbineId(Guid turbineId)
        {
            var resultList = _mapper.Map<IEnumerable<IdText>>(_bladeService.GetAllBladesByTurbineId(turbineId));

            return resultList.OrderBy(x => x.Text);
        }

        [Route("bladeIdByFindingId/{findingId}")]
        [HttpGet]
        public Guid GetBladeIdByFindingId(Guid findingId)
        {
            return _defectApiService.FindById(findingId).Sequence.BladeId;
        }

        [Route("getBladeById/{bladeId?}")]
        [HttpGet]
        public IdText GetBladeById(Guid bladeId)
        {
            var result=  _mapper.Map<IdText>(_bladeService.GetBlade(bladeId));
            return result;
        }
        #endregion

        #region Helper

        private static void AssignNumberOfDefectsPerSeverity(IEnumerable<HermesOnline.Domain.Defect> defects, BladeOverviewDto overviewDto)
        {            
                overviewDto.SeverityDefects[Severity.Zero] =
                    defects.Count(x => x.Severity == Severity.Zero);
                overviewDto.SeverityDefects[Severity.One] =
                    defects.Count(x => x.Severity == Severity.One);
                overviewDto.SeverityDefects[Severity.Two] =
                    defects.Count(x => x.Severity == Severity.Two);
                overviewDto.SeverityDefects[Severity.Three] =
                    defects.Count(x => x.Severity == Severity.Three);
                overviewDto.SeverityDefects[Severity.Four] =
                    defects.Count(x => x.Severity == Severity.Four);
                overviewDto.SeverityDefects[Severity.Five] =
                    defects.Count(x => x.Severity == Severity.Five);         
        }

        #endregion
    }
}
