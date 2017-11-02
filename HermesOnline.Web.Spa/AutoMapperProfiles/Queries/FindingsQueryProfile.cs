using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Web.Spa.Dtos.Blades;
using HermesOnline.Web.Spa.Dtos.Findings;
using HermesOnline.Web.Spa.Dtos.SummaryView;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Queries
{
    public class FindingsQueryProfile : Profile
    {
        public FindingsQueryProfile()
        {
            CreateMap<SummaryViewFilterModelDto, FindingsSummaryFilterModel>();

            CreateMap<BladeOverviewItemFilterModelDto, FindingsBladeOverviewItemFilterModel>();

            CreateMap<FindingsDataTableFilterModelDto, FindingsQuery>()
                .ForMember(dest => dest.Sorter, opt => opt.MapFrom(src => src.GetOrderBy()));

            CreateMap<FindingsForDeepZoomLinkDataTableFilterModelDto, FindingsQuery>()
                .ForMember(dest => dest.Sorter, opt => opt.MapFrom(src => src.GetOrderBy()));
        }
    }
}