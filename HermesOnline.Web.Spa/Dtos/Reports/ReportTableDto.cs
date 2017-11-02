using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos
{
    public class ReportTableDto
    {
        public List<ReportTableRowDto> ReportTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}