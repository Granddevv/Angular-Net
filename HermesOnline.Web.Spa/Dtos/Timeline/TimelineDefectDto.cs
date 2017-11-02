using System;

namespace HermesOnline.Web.Spa.Dtos.Timeline
{
    public class TimelineFindingDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string DistanceToRoot { get; set; }
        public int Severity { get; set; }        
        public Guid ImageId { get; set; }
        public string InspectionDate { get; set; }
    }
}
