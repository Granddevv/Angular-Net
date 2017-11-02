using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.QuickFilters.DeepZoomLink
{
    public class DeepZoomLinkDataTableQuickFilterListDto
    {
        public IEnumerable<QuickFilterListItemDto> Site { get; set; }

        public IEnumerable<QuickFilterListItemDto> TurbineSerial { get; set; }

        public IEnumerable<QuickFilterListItemDto> Turbine { get; set; }

        public IEnumerable<QuickFilterListItemDto> Blade { get; set; }

        public IEnumerable<QuickFilterListItemDto> Surface { get; set; }

        public IEnumerable<QuickFilterListItemDto> Date { get; set; }

        public IEnumerable<QuickFilterListItemDto> PhotoSource { get; set; }

        public IEnumerable<QuickFilterListItemDto> Inspection { get; set; }

        public IEnumerable<QuickFilterListItemDto> Region { get; set; }

        public IEnumerable<QuickFilterListItemDto> Country { get; set; }
    }
}