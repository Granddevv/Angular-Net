using System;

namespace HermesOnline.Web.Spa.Dtos.Log
{
    public class LogTableRowDto
    {
        public Guid Id { get; set; }

        public string Host { get; set; }

        public string Code { get; set; }

        public string Type { get; set; }

        public string Error { get; set; }

        public string User { get; set; }

        public string Date { get; set; }

        public string Source { get; set; }

        public string Detail { get; set; }
    }
}