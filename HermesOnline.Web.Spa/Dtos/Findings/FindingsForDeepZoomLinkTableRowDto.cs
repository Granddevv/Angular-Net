using System;

namespace HermesOnline.Web.Spa.Dtos.Findings
{
    public class FindingsForDeepZoomLinkTableRowDto
    {
        public Guid Id { get; set; }

        public string SerialNumber { get; set; }

        public string Name { get; set; }

        public string Severity { get; set; }

        public string DistanceToRoot { get; set; }

        public string LengthMm { get; set; }

        public string AreaMm2 { get; set; }
    }
}