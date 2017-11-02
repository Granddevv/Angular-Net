using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.Announcements
{
    public class AnnouncementsTableDto
    {
        public IList<AnnouncementsTableRowDto> AnnouncementsTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}