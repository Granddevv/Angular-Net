using System;

namespace HermesOnline.Web.Spa.Dtos.Findings
{
    public class FindingsTableRowDto
    {
        public Guid Id { get; set; }

        public string Severity { get; set; }

        public string Type { get; set; }

        public string Layer { get; set; }

        public string DistanceToRoot { get; set; }

        public string DistanceToTip { get; set; }

        public string LengthMm { get; set; }

        public string AreaMm2 { get; set; }

        public string Site { get; set; }

        public string TurbineSerialNumber { get; set; }

        public string TurbineName { get; set; }

        public string TurbineType { get; set; }

        public string Platform { get; set; }

        public string Blade { get; set; }

        public string Surface { get; set; }

        public string InspectionDate { get; set; }

        public string InspectionType { get; set; }

        public string InspectionCompany { get; set; }

        public string SerialNumber { get; set; }

        public string DataQuality { get; set; }

        public Guid SiteId { get; set; }
    }
}