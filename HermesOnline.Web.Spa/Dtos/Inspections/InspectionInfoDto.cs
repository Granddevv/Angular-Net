using System;

namespace HermesOnline.Web.Spa.Dtos.Inspections
{
    public class InspectionInfoDto
    {
        public Guid Id { get; set; }

        public string Company { get; set; }

        public DateTime? Date { get; set; }

        public string Name { get; set; }
    }
}