using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.DeepZoomLink
{
    public class DeepZoomLinkTableDto
    {
        public IList<DeepZoomLinkTableRowDto> DeepZoomLinkTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}