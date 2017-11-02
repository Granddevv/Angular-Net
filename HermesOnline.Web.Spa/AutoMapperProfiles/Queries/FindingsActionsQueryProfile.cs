using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos;
using HermesOnline.Web.Spa.Dtos.Findings;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Queries
{
    public class FindingsActionsQueryProfile : Profile
    {
        public FindingsActionsQueryProfile()
        {
            CreateMap<FindingsActionsDataTableFilterModelDto, FindingsActionsQuery>()
                .ForMember(x => x.Sorter, opt => opt.MapFrom(y => y.GetOrderBy()));
        }
    }
}