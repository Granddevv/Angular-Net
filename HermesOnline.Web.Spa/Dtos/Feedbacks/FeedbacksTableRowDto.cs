using System;

namespace HermesOnline.Web.Spa.Dtos.Feedbacks
{
    public class FeedbacksTableRowDto
    {
        public Guid Id { get; set; }

        public string Date { get; set; }

        public string User { get; set; }

        public string Type { get; set; }

        public string Category { get; set; }

        public string Description { get; set; }

        public string FileName{ get; set; }

        public string Status { get; set; }

        public string Comment { get; set; }

        public string Url { get; set; }
    }
}