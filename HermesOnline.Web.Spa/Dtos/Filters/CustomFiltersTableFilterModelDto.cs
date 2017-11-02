using HermesOnline.Core.Data;
using HermesOnline.Domain.CustomFilters;

namespace HermesOnline.Web.Spa.Dtos.Filters
{
    public class CustomFiltersTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public string SortProperty { get; set; }

        public OrderDirection SortDirection { get; set; }

        public OrderBy<CustomFilter> GetOrderBy()
        {
            OrderBy<CustomFilter> orderBy;

            switch (SortProperty)
            {
                case "date":
                    orderBy = new OrderBy<CustomFilter>(SortDirection, x => x.Date);
                    break;
                default:
                    orderBy = new OrderBy<CustomFilter>(OrderDirection.Descending, x => x.Date);
                    break;
            }

            return orderBy;
        }
    }
}