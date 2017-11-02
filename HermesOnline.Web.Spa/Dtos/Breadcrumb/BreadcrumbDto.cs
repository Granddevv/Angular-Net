using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.Dtos.Breadcrumb
{
    public class BreadcrumbDto
    {
        public IdValue Region { get; set; }

        public IdValue Country { get; set; }

        public IdValue Site { get; set; }
    }

    public class SiteBreadcrumbDto : BreadcrumbDto
    {
        public string TurbineCount { get; set; }
    }

    public class TurbineBreadcrumbDto : BreadcrumbDto
    {
        public IdValue Turbine { get; set; }
    }

    public class BladeBreadcrumbDto : TurbineBreadcrumbDto
    {
        public IdValue Blade { get; set; }
    }

    public class DefectBreadcrumbDto : BladeBreadcrumbDto
    {
        public string Surface { get; set; }
        public string SerialNumber { get; set; }
    }
}