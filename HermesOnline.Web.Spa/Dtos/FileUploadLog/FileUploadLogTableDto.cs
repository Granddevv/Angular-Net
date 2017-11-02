using System.Collections.Generic;
using HermesOnline.Web.Spa.Controllers;

namespace HermesOnline.Web.Spa.Dtos.FileUploadLog
{
    public class FileUploadLogTableDto
    {
        public IList<FileUpladLogTableRowDto> FileUploadLogTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}