using System;
using HermesOnline.Domain;

namespace HermesOnline.Web.Spa.Dtos.Node
{
    public class NodeDto
    {
        public NodeType NodeType { get; set; }
        public Guid NodeId { get; set; }
    }
}
