using HermesOnline.Core.Data;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Domain.Feedbacks;

namespace HermesOnline.Web.Spa.Dtos.Feedbacks
{
    public class FeedbacksTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public string SearchUser { get; set; }

        public string SortProperty { get; set; }

        public OrderDirection SortDirection { get; set; }

        public FeedbackQuickFilterModel QuickFilters { get; set; }

        public OrderBy<Feedback> GetOrderBy()
        {
            OrderBy<Feedback> orderBy;

            switch (SortProperty)
            {
                case "date":
                    orderBy = new OrderBy<Feedback>(SortDirection, x => x.Date);
                    break;
                case "user":
                    orderBy = new OrderBy<Feedback>(SortDirection, x => x.User.Email);
                    break;
                case "type":
                    orderBy = new OrderBy<Feedback>(SortDirection, x => x.Type);
                    break;
                case "category":
                    orderBy = new OrderBy<Feedback>(SortDirection, x => x.Category);
                    break;
                case "status":
                    orderBy = new OrderBy<Feedback>(SortDirection, x => x.Status);
                    break;
                default:
                    orderBy = new OrderBy<Feedback>(OrderDirection.Descending, x => x.Date);
                    break;
            }

            return orderBy;
        }
    }
}