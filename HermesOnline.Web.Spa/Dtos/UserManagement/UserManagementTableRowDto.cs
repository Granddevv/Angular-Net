using System;

namespace HermesOnline.Web.Spa.Dtos.UserManagement
{
    public class UserManagementTableRowDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public bool IsActive { get; set; }

        public Guid GroupId{ get; set; }

        public string GroupName{ get; set; }
    }
}