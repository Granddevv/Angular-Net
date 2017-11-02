using System;
using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.Timeline
{
    public class TimelineInspectionDto
    {
        public Guid Id { get; set; }        
        public string InspectionDate { get; set; }
        public string InspectionYear { get; set; }
        public IEnumerable<TimelineFindingDto> Findings { get; set; }
    }
}
