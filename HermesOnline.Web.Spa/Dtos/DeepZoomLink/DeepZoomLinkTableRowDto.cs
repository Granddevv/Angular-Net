using System;

namespace HermesOnline.Web.Spa.Dtos.DeepZoomLink
{
    public class DeepZoomLinkTableRowDto
    {
        public Guid Id { get; set; }

        public string Site { get; set; }

        public string TurbineSerialNumber { get; set; }

        public string TurbineName { get; set; }

        public string Blade { get; set; }

        public Guid BladeId { get; set; }

        public string Surface { get; set; }

        public string Date { get; set; }

        public string Photo { get; set; }

        public string Country { get; set; }

        public string Url { get; set; }

        public string Inspection { get; set; }

        public string Region { get; set; }
    }
}