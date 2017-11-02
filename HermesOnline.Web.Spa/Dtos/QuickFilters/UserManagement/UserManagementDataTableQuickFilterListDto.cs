using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.QuickFilters.UserManagement
{
    public class UserManagementDataTableQuickFilterListDto
    {
        public IEnumerable<QuickFilterListItemDto> Group { get; set; }
    }
}