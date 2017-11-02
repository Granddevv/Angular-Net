using System;
using System.Collections.Generic;
using Aether.Utils.ScreenCapture;
using HermesOnline.Web.Spa.Dtos.Inspections;

namespace HermesOnline.Web.Spa.Dtos.Blades
{
    public class BladeInfoDto
    {
        public Guid Id { get; set; }
        public string FleetName { get; set; }
        public string SiteName { get; set; }
        public string TurbineName { get; set; }
        public string BladeName { get; set; }

        public IEnumerable<InspectionInfoDto> Inspections { get; set; }
        
        public string ToRelativePath(Surface? surface, InspectionInfoDto inspection)
        {            
            return $"{FleetName}/{SiteName}/{inspection.Name}/{TurbineName}/{BladeName}/{surface}";
        }
    }
}