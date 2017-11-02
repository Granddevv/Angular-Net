using System;
using HermesOnline.Domain;
using HermesOnline.Domain.UserActivity;

namespace HermesOnline.Web.Spa.Dtos.UserManagement
{
    public class UserActivitySaveRequestDto
    {
        public TabView TabView { get; set; }

        public string Url { get; set; }

        public NodeType NodeType { get; set; }

        public Guid NodeId { get; set; }

        public Guid RowId { get; set; }
    }
}