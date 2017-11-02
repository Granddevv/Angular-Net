using System;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Service.InterfacesApi;
using System.Collections.Generic;
using HermesOnline.Core.Extensions;
using HermesOnline.Domain.Identity;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Dtos.Timeline;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/Timeline")]
    [AuthorizationUser(Permission.TimelineNavigation)]
    public class TimelineController : BaseController
    {
        private readonly ITimelineApiService _timelineApiService;
        private readonly IMapper _mapper;

        public TimelineController(ITimelineApiService timelineApiService, IMapper mapper)     
        {
            _timelineApiService = timelineApiService;
            _mapper = mapper;            
        }

        [Route("InspectionList/{findingId}")]
        [HttpGet]
        public IHttpActionResult GetTimelineInspectionList(Guid findingId)
        {
            var result = _timelineApiService.GetTimelineFindingList(findingId);

            if(!result.Succeeded)
            {
                return BadRequest(result.Message);
            }

            var defects = result.ResultObject;
            var inspections = defects.Select(x => x.Sequence.Inspection).DistinctBy(x=> x.Id).OrderBy(x=> x.Date.Value.Year);

            var inspectionDtos = _mapper.Map<IEnumerable<TimelineInspectionDto>>(inspections);            

            foreach(var inspection in inspectionDtos)
            {
                var inspectionDefects = defects.Where(x => x.Sequence.InspectionId == inspection.Id).OrderBy(x=> x.DistanceToRoot);
                inspection.Findings = 
                    _mapper.Map<IEnumerable<TimelineFindingDto>>(inspectionDefects);
            }

            return Ok(inspectionDtos);            
        }
    }
}
