using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.Filters
{
    public class CustomFiltersTableDto
    {
        public IList<CustomFiltersTableRowDto> CustomFiltersTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}