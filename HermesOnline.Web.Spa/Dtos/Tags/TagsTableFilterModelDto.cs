using HermesOnline.Core.Data;
using HermesOnline.Domain.Tag;

namespace HermesOnline.Web.Spa.Dtos.Tags
{
    public class TagsTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public string SortProperty { get; set; }

        public OrderDirection SortDirection { get; set; }

        public OrderBy<Tag> GetOrderBy()
        {
            OrderBy<Tag> orderBy;

            switch (SortProperty)
            {
                case "name":
                    orderBy = new OrderBy<Tag>(SortDirection, x => x.Name);
                    break;
                case "createdOn":
                    orderBy = new OrderBy<Tag>(SortDirection, x => x.ModifiedDate);
                    break;
                case "modifiedBy":
                    orderBy = new OrderBy<Tag>(SortDirection, x => x.User.FirstName);
                    break;
                default:
                    orderBy = new OrderBy<Tag>(SortDirection, x => x.ModifiedDate);
                    break;
            }

            return orderBy;
        }
    }
}