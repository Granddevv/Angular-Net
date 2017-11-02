using System;
using Aether.Utils.ScreenCapture;

namespace HermesOnline.Web.Spa.Dtos.Blades
{
    public class BladeOverviewItemFilterModelDto
    {
        public Guid BladeId { get; set; }

        public Severity Severity { get; set; }
    }
}