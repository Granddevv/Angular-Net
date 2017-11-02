using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.Findings
{
    public class FindingsTableDto<T>
    {
        public IList<T> FindingsTableRows { get; set; }

        public int TotalRecords { get; set; }
    }
}