using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos.Filters;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Queries
{
    public class CustomFilterQueryProfile : Profile
    {
        public CustomFilterQueryProfile()
        {
            CreateMap<CustomFiltersTableFilterModelDto, CustomFilterQuery>()
                 .ForMember(x => x.Sorter, opt => opt.MapFrom(y => y.GetOrderBy()));
        }
    }
}