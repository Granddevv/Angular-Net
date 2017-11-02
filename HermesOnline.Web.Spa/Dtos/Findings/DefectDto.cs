using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.Dtos.Findings
{
    public class DefectDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DistanceToRoot { get; set; }
        public string AreaMM2 { get; set; }
        public string LengthMM { get; set; }
        public string SiteId { get; set; }
        public string TurbineId { get; set; }
        public string BladeId { get; set; }
        public string Surface { get; set; }
        public string SerialNumber { get; set; }
        public string Layer { get; set; }
        public int Severity { get; set; }
        public string PixelsPerMM { get; set; }
        public IdValue Country { get; set; }
        public IdValue Region { get; set; }
        public string DataQuality { get; set; }
        public bool IsInGroup { get; set; }
        public DefectGroupType GroupType { get; set; }
        
    }
}
