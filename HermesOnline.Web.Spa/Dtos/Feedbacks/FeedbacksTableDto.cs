using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.Feedbacks
{
    public class FeedbacksTableDto
    {
        public IList<FeedbacksTableRowDto> FeedbacksTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}