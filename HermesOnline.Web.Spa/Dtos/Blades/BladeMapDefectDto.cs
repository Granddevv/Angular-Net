using System;
using Aether.Utils.ScreenCapture;

namespace HermesOnline.Web.Spa.Dtos.Blades
{
    public class BladeMapDefectDto
    {
        public Guid Id { get; set; }
        public Surface Surface { get; set; }
        public Severity? Severity { get; set; }
        public decimal? DistToLe { get; set; }
        public decimal? DistToTe { get; set; }
        public decimal? DistanceToRoot { get; set; }
        public decimal BladeLength { get; set; }
        public decimal BladeWidth { get; set; }
        public string Name { get; set; }
        public decimal? LPSReading { get; set; }
    }
}