using System;
using HermesOnline.Domain.Defects;

namespace HermesOnline.Web.Spa.Dtos.Findings
{
    public class DefectChangedQuality
    {
      public  Guid Id { get; set; }

      public DataQuality UpdatedQuality { get; set; }

      public Guid SiteId { get; set; }
    }
}
