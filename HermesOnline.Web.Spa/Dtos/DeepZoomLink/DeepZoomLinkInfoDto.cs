using System;
using System.Collections.Generic;
using Aether.Utils.ScreenCapture;
using HermesOnline.Web.Spa.Dtos.Annotations;

namespace HermesOnline.Web.Spa.Dtos.DeepZoomLink
{
    public class DeepZoomLinkInfoDto
    {
        public string TileSize { get; set; }

        public string Overlap { get; set; }

        public string Width { get; set; }

        public string Height { get; set; }

        public Guid DeepZoomLinkId { get; set; }

        public Guid InspectionId { get; set; }

        public Guid BladeId { get; set; }

        public Surface Surface { get; set; }

        public List<DeepZoomLinkAnnotationsDto> Annotations { get; set; }
    }
}