using System;

namespace HermesOnline.Web.Spa.Dtos.Announcements
{
    public class AnnouncementsTableRowDto
    {
        public Guid Id { get; set; }

        public string Date { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string FileName{ get; set; }
    }
}