using System;

namespace HermesOnline.Web.Spa.Dtos.DeepZoomLink
{
    public class AddNewDeepZoomLinkDto
    {
        public Guid FleetId { get; set; }
        public Guid SiteId { get; set; }
        public Guid InspectionId { get; set; }
        public string FolderPath { get; set; }
    }
}