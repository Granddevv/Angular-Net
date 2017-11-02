using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.QuickFilters.Feedback
{
    public class FeedbackDataTableQuickFilterListDto
    {
        public IEnumerable<QuickFilterListItemDto> Type { get; set; }

        public IEnumerable<QuickFilterListItemDto> Category { get; set; }

        public IEnumerable<QuickFilterListItemDto> Status { get; set; }
    }
}