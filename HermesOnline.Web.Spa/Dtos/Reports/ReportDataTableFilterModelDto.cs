using System;
using HermesOnline.Domain;
using HermesOnline.Core.Data;

namespace HermesOnline.Web.Spa.Dtos
{
    public class ReportDataTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public Guid Id { get; set; }

        public NodeType Type { get; set; }

        public string SortProperty { get; set; }

        public OrderDirection SortDirection { get; set; }

        public OrderBy<Report> GetOrderBy()
        {
            OrderBy<Report> orderBy;

            switch (SortProperty)
            {
                case "fileName":
                    orderBy = new OrderBy<Report>(SortDirection, x => x.Filename);
                    break;
                case "queueDate":
                    orderBy = new OrderBy<Report>(SortDirection, x => x.QueueDate);
                    break;
                case "size":
                    orderBy = new OrderBy<Report>(SortDirection, x => x.QueueDate);
                    break;
                default:
                    orderBy = new OrderBy<Report>(SortDirection, x => x.Id);
                    break;
            }

            return orderBy;
        }
    }
}