using System;
using System.Linq.Expressions;
using HermesOnline.Domain;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Finding
{
    public static class DefectCountQueryHelper
    {
        public static Expression<Func<Defect, bool>> Query
        {
            get { return d => !d.IsDeleted && !d.IsMobile && d.OriginalDefectId == null && d.DefectGroupItem == null || d.DefectGroupItem.IsRoot; }
        }
    }
}