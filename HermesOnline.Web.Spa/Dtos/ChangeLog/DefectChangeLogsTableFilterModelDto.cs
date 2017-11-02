using HermesOnline.Core.Data;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Domain;

namespace HermesOnline.Web.Spa.Dtos.ChangeLog
{
    public class DefectChangeLogsTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public string SortProperty { get; set; }

        public OrderDirection SortDirection { get; set; }

        public DefectChangeLogQuickFilterModel QuickFilters { get; set; }

        public OrderBy<DefectChangeLog> GetOrderBy()
        {
            OrderBy<DefectChangeLog> orderBy;

            switch (SortProperty)
            {
                case "date":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.DateModified);
                    break;
                case "user":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.User.FullName);
                    break;
                case "originalLayer":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.DefectOriginalLayerType.Name);
                    break;
                case "originalType":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.OriginalType);
                    break;
                case "originalSeverity":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.OriginalSeverity);
                    break;
                case "newLayer":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.DefectNewLayerType.Name);
                    break;
                case "newType":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.NewType);
                    break;
                case "newSeverity":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.NewSeverity);
                    break;
                case "site":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.Defect.Sequence.Blade.Turbine.Site.Name);
                    break;
                case "serialNumber":
                    orderBy = new OrderBy<DefectChangeLog>(SortDirection, x => x.Defect.SerialNumber);
                    break;
                default:
                    orderBy = new OrderBy<DefectChangeLog>(OrderDirection.Descending, x => x.DateModified);
                    break;
            }

            return orderBy;
        }
    }
}