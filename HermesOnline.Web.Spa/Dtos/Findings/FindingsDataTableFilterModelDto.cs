using System;
using HermesOnline.Core.Data;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Domain;
using Defect = HermesOnline.Domain.Defect;
using HermesOnline.Web.Spa.Dtos.Blades;
using HermesOnline.Web.Spa.Dtos.SummaryView;

namespace HermesOnline.Web.Spa.Dtos.Findings
{
    public class FindingsDataTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public Guid Id { get; set; }

        public NodeType Type { get; set; }

        public FindingsQuickFilterModel QuickFilters { get; set; }

        public SummaryViewItemFilterModelDto[] SummaryViewFilter;

        public BladeOverviewItemFilterModelDto BladeOverViewItemFilter;

        public Guid CustomFilterId;

        public Guid[] TimeLineFilter;

        public Guid? GroupFilter { get; set; }

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
                case "dataQuality":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.DataQuality);
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
                case "distanceToTip":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.DistanceToTip);
                    break;
                case "lengthMm":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.LengthMM);
                    break;
                case "areaMm2":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.AreaMM2);
                    break;
                case "site":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Sequence.Blade.Turbine.Site.Name);
                    break;
                case "turbineName":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Sequence.Blade.Turbine.Name);
                    break;
                case "turbineType":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Sequence.Blade.Turbine.Type);
                    break;
                case "platform":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Sequence.Blade.Turbine.Platform);
                    break;
                case "blade":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Sequence.Blade.Name);
                    break;
                case "surface":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Surface);
                    break;
                case "inspectionDate":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Sequence.Inspection.Date);
                    break;
                case "inspectionType":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Sequence.Inspection.Type);
                    break;
                case "inspectionCompany":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Sequence.Inspection.Company);
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