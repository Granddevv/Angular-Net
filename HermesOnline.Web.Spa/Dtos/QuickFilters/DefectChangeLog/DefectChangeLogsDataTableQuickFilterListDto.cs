using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.QuickFilters
{
    public class DefectChangeLogsDataTableQuickFilterListDto
    {
        public IEnumerable<QuickFilterListItemDto> OriganalSeverity { get; set; }

        public IEnumerable<QuickFilterListItemDto> OriginalCategory { get; set; }

        public IEnumerable<QuickFilterListItemDto> OriginalLayer { get; set; }

        public IEnumerable<QuickFilterListItemDto> Site { get; set; }

        public IEnumerable<QuickFilterListItemDto> NewSeverity { get; set; }

        public IEnumerable<QuickFilterListItemDto> NewCategory { get; set; }

        public IEnumerable<QuickFilterListItemDto> NewLayer { get; set; }
    }
}