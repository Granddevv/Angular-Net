using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.ChangeLog
{
    public class DefectChangeLogsTableDto
    {
        public IList<DefectChangeLogsTableRowDto> DefectChangeLogsTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}