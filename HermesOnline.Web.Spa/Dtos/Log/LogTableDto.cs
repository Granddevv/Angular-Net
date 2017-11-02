using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.Log
{
    public class LogTableDto
    {
        public IList<LogTableRowDto> LogTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}