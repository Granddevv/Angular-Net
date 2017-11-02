using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.QuickFilters.Findings
{
    public class FindingsDataTableQuickFilterListDto
    {
        public IEnumerable<QuickFilterListItemDto> Severity { get; set; }

        public IEnumerable<QuickFilterListItemDto> Category { get; set; }

        public IEnumerable<QuickFilterListItemDto> Layer { get; set; }

        public IEnumerable<QuickFilterListItemDto> Site { get; set; }

        public IEnumerable<QuickFilterListItemDto> TurbineName { get; set; }

        public IEnumerable<QuickFilterListItemDto> TurbineType { get; set; }

        public IEnumerable<QuickFilterListItemDto> Platform { get; set; }

        public IEnumerable<QuickFilterListItemDto> Blade { get; set; }

        public IEnumerable<QuickFilterListItemDto> Surface { get; set; }

        public IEnumerable<QuickFilterListItemDto> InspectionDate { get; set; }

        public IEnumerable<QuickFilterListItemDto> InspectionType { get; set; }

        public IEnumerable<QuickFilterListItemDto> InspectionCompany { get; set; }

        public IEnumerable<QuickFilterListItemDto> DataQuality { get; set; }
    }
}