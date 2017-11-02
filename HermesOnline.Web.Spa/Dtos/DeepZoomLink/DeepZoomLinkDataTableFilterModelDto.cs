using System;
using HermesOnline.Core.Data;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Domain;

namespace HermesOnline.Web.Spa.Dtos.DeepZoomLink
{
    public class DeepZoomLinkDataTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public Guid Id { get; set; }

        public NodeType Type { get; set; }

        public DeepZoomLinkQuickFilterModel QuickFilters { get; set; }

        public Guid ExcludeDeepZoomLinkId { get; set; }

        public bool IsCompareToSameBlade { get; set; }

        public string SortProperty { get; set; }

        public OrderDirection SortDirection { get; set; }

        public OrderBy<Domain.DeepZoomLink> GetOrderBy()
        {
            OrderBy<Domain.DeepZoomLink> orderBy;

            switch (SortProperty)
            {
                case "site":
                    orderBy = new OrderBy<Domain.DeepZoomLink>(SortDirection, x => x.Blade.Turbine.Site.Name);
                    break;
                case "turbineSerialNumber":
                    orderBy = new OrderBy<Domain.DeepZoomLink>(SortDirection, x => x.Blade.Turbine.SerialNumber);
                    break;
                case "turbineName":
                    orderBy = new OrderBy<Domain.DeepZoomLink>(SortDirection, x => x.Blade.Turbine.Name);
                    break;
                case "blade":
                    orderBy = new OrderBy<Domain.DeepZoomLink>(SortDirection, x => x.Blade.Name);
                    break;
                case "surface":
                    orderBy = new OrderBy<Domain.DeepZoomLink>(SortDirection, x => x.Surface);
                    break;
                case "date":
                    orderBy = new OrderBy<Domain.DeepZoomLink>(SortDirection, x => x.Inspection.Date);
                    break;
                case "inspection":
                    orderBy = new OrderBy<Domain.DeepZoomLink>(SortDirection, x => x.Inspection.Name);
                    break;
                default:
                    orderBy = new OrderBy<Domain.DeepZoomLink>(SortDirection, x => x.Id);
                    break;
            }

            return orderBy;
        }
    }
}