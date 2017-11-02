using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Aether.Utils.ScreenCapture;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Service.Interfaces;
using HermesOnline.Web.Spa.Dtos;
using Defect = HermesOnline.Domain.Defect;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Domain.Identity;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Dtos.SummaryView;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/SummaryView")]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class SummaryViewController : ApiController
    {
        private readonly IBladeService _bladeService;
        private readonly IDefectApiService _defectService;
        private readonly IMapper _mapper;

        public SummaryViewController(
            IBladeService bladeService,
            IDefectApiService defectService,
            IMapper mapper)
        {
            _bladeService = bladeService;
            _defectService = defectService;
            _mapper = mapper;
        }

        [Route("bladesurfacedata/{nodeId}/{nodeType}/{surface}")]
        [HttpGet]
        public IEnumerable<SummaryViewDto> GetBladeSurfaceData(Guid nodeId, NodeType nodeType, Surface surface)
        {
            var defects = _defectService.GetDefectsForNode(nodeId, nodeType).Where(x => x.Surface == surface);

            var maxSeverityDictionarty = new Dictionary<int, Defect>();

            foreach (var defect in defects)
            {
                if (!defect.DistanceToRoot.HasValue)
                    continue;

                var meter = (int)Math.Floor(defect.DistanceToRoot.Value) + 1;

                if (!maxSeverityDictionarty.ContainsKey(meter))
                {
                    maxSeverityDictionarty.Add(meter, defect);
                }
                else
                {
                    if (maxSeverityDictionarty[meter].Severity < defect.Severity)
                    {
                        maxSeverityDictionarty[meter] = defect;
                    }
                }
            }

            var result = _mapper.Map<IEnumerable<SummaryViewDto>>(maxSeverityDictionarty.Values);
            return result;
        }

        [Route("filteredbladesurfacedata")]
        [HttpPost]
        public IEnumerable<SummaryViewDto> GetFilteredBladeSurfaceData(SummaryViewFilterModelDto filter)
        {
            var defectQuery = _mapper.Map<FindingsQuery>(filter);
            var defects = _defectService.GetDefectsForNode(filter.Type, filter.NodeId, defectQuery).Where(x => x.Surface == filter.Surface);

            var maxSeverityDictionarty = new Dictionary<int, Defect>();

            foreach (var defect in defects)
            {
                if (!defect.DistanceToRoot.HasValue)
                    continue;

                var meter = (int)Math.Floor(defect.DistanceToRoot.Value) + 1;

                if (!maxSeverityDictionarty.ContainsKey(meter))
                {
                    maxSeverityDictionarty.Add(meter, defect);
                }
                else
                {
                    if (maxSeverityDictionarty[meter].Severity < defect.Severity)
                    {
                        maxSeverityDictionarty[meter] = defect;
                    }
                }
            }

            var result = _mapper.Map<IEnumerable<SummaryViewDto>>(maxSeverityDictionarty.Values);
            return result;
        }
    }
}
