using HermesOnline.Core.Data;
using HermesOnline.Domain.General;

namespace HermesOnline.Web.Spa.Dtos.Announcements
{
    public class AnnouncementsTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public string SortProperty { get; set; }

        public OrderDirection SortDirection { get; set; }

        public OrderBy<Announcement> GetOrderBy()
        {
            OrderBy<Announcement> orderBy;

            switch (SortProperty)
            {
                case "date":
                    orderBy = new OrderBy<Announcement>(SortDirection, x => x.Date);
                    break;
                default:
                    orderBy = new OrderBy<Announcement>(OrderDirection.Descending, x => x.Date);
                    break;
            }

            return orderBy;
        }
    }
}