using System;

namespace HermesOnline.Web.Spa.Dtos.FileUploadLog
{
    public class FileUpladLogTableRowDto
    {
        public Guid Id { get; set; }

        public string Time { get; set; }

        public string FileName { get; set; }

        public string Status { get; set; }
    }
}