using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos.Reports;
using HermesOnline.Web.Spa.Dtos.Node;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Finding
{
    public class DefectQueryProfile : Profile
    {
        public DefectQueryProfile()
        {
            CreateMap<GetDataExtractReportDto, FindingsQuery>();

            CreateMap<NodeDto, FindingsQuery>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.NodeId))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.NodeType));
        }
    }
}