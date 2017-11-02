using System;
using HermesOnline.Core.Data;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Domain;

namespace HermesOnline.Web.Spa.Dtos.Findings
{
    public class FindingsActionsDataTableFilterModelDto
    {
        public Guid Id { get; set; }

        public DefectGroupType DefectAction { get; set; }

        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public FindingsQuickFilterModel QuickFilters { get; set; }

        public string SortProperty { get; set; }

        public OrderDirection SortDirection { get; set; }

        public OrderBy<Defect> GetOrderBy()
        {
            OrderBy<Defect> orderBy;

            switch (SortProperty)
            {
                case "type":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Name);
                    break;
                case "severity":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Severity);
                    break;
                case "layer":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.DefectLayerType.Name);
                    break;
                case "distanceToRoot":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.DistanceToRoot);
                    break;
                case "lengthMm":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.LengthMM);
                    break;
                case "areaMm2":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.AreaMM2);
                    break;
                case "surface":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Surface);
                    break;
                case "serialNumber":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.SerialNumber);
                    break;
                default:
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.SerialNumber);
                    break;
            }

            return orderBy;
        }
    }
}