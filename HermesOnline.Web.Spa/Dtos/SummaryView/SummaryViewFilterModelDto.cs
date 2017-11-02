using Aether.Utils.ScreenCapture;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Domain;
using System;

namespace HermesOnline.Web.Spa.Dtos.SummaryView
{
    public class SummaryViewFilterModelDto
    {
        public Guid NodeId;
        public NodeType Type;
        public Surface Surface;
        public FindingsQuickFilterModel QuickFilters;
        public SummaryViewItemFilterModelDto[] SummaryViewFilter;
    }
}