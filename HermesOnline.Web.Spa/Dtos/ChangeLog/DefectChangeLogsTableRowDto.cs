using System;

namespace HermesOnline.Web.Spa.Dtos.ChangeLog
{
    public class DefectChangeLogsTableRowDto
    {
        public Guid Id { get; set; }

        public string DateModified { get; set; }

        public string OriginalSeverity { get; set; }

        public string OriginalLayer { get; set; }

        public string OriginalType { get; set; }

        public string NewSeverity { get; set; }

        public string NewLayer { get; set; }

        public string NewType { get; set; }

        public string User { get; set; }

        public string Site { get; set; }

        public string SerialNumber { get; set; }

        public string Comment { get; set; }

        public string DefectId { get; set; }
    }
}