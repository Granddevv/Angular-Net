using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.UserManagement
{
    public class UserManagementTableDto
    {
        public IList<UserManagementTableRowDto> UserManagmentTableRows { get; set; }

        public int TotalDisplayedRecords { get; set; }

        public int TotalRecords { get; set; }
    }
}