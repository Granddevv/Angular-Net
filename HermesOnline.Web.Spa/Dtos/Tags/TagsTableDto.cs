using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.Tags
{
    public class TagsTableDto
    {
        public IList<TagsTableRowDto> TagsTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}