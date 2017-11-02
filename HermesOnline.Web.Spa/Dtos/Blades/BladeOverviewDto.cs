using System.Collections.Generic;
using Aether.Utils.ScreenCapture;

namespace HermesOnline.Web.Spa.Dtos.Blades
{
    public class BladeOverviewDto
    {
        public BladeOverviewDto()
        {
            this.SeverityDefects = new Dictionary<Severity, int> {{Severity.Zero, 0}, { Severity.One, 0 } , { Severity.Two, 0 } , { Severity.Three, 0 } , { Severity.Four, 0 } , { Severity.Five, 0 } };
        }

        public string Id { get; set; }
        public string Value { get; set; }
        public Dictionary<Severity, int> SeverityDefects { get; set; }
    }
}
