using System;

namespace HermesOnline.Web.Spa.Dtos.UserManagement
{
    public class UserActivityTableRowDto
    {
        public string Id { get; set; }

        public Guid NodeId { get; set; }

        public string ViewType { get; set; }

        public Guid RowId { get; set; }

        public string ViewedOn { get; set; }

        public string Path { get; set; }

        public string Filters { get; set; }

        public string UrlFilter { get; set; }
    }
}