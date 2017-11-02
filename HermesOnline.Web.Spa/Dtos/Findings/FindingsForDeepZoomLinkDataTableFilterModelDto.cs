using System;
using Aether.Utils.ScreenCapture;
using HermesOnline.Core.Data;
using Defect = HermesOnline.Domain.Defect;

namespace HermesOnline.Web.Spa.Dtos.Findings
{
    public class FindingsForDeepZoomLinkDataTableFilterModelDto
    {
        public Guid Id { get; set; }

        public Surface Surface { get; set; }

        public Guid InspectionId { get; set; }

        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public OrderDirection SortDirection { get; set; }

        public string SortProperty { get; set; }

        public OrderBy<Defect> GetOrderBy()
        {
            OrderBy<Defect> orderBy;

            switch (SortProperty)
            {
                case "name":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Name);
                    break;
                case "severity":
                    orderBy = new OrderBy<Defect>(SortDirection, x => x.Severity);
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