using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.SummaryView;
using System;

namespace HermesOnline.Web.Spa.Dtos.Reports
{
    public class GetDataExtractReportDto
    {
        public Guid TaskId { get; set; }
        public bool GenerateImages { get; set; }
        public NodeType NodeType { get; set; }
        public Guid NodeId { get; set; }
        public FindingsQuickFilterModel QuickFilters;
        public SummaryViewItemFilterModelDto[] SummaryViewFilter;
        public Guid[] TimeLineFilter;
    }
}