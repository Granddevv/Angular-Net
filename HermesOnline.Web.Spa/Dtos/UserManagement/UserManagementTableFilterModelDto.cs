using System.Collections.Generic;
using System.Linq;
using HermesOnline.Core.Data;
using HermesOnline.Domain.Identity;
using HermesOnline.Data.Interface.Query.Model;

namespace HermesOnline.Web.Spa.Dtos.UserManagement
{
    public class UserManagementTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public string SearchName { get; set; }

        public IEnumerable<string> Statuses { get; set; }

        public UserQuickFilterModel QuickFilters { get; set; }

        public string SortProperty { get; set; }

        public OrderDirection SortDirection { get; set; }

        public OrderBy<User> GetOrderBy()
        {
            OrderBy<User> orderBy;

            switch (SortProperty)
            {
                case "name":
                    orderBy = new OrderBy<User>(SortDirection, x => x.FirstName);
                    break;
                case "email":
                    orderBy = new OrderBy<User>(SortDirection, x => x.Email);
                    break;
                case "isActive":
                    orderBy = new OrderBy<User>(SortDirection, x => x.IsActive);
                    break;
                case "groupName":
                    orderBy = new OrderBy<User>(SortDirection, x => x.Group.Name);
                    break;
                default:
                    orderBy = new OrderBy<User>(SortDirection, x => x.FirstName);
                    break;
            }

            return orderBy;
        }
    }
}