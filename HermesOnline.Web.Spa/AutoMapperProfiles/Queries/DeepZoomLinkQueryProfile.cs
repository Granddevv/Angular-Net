using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos.DeepZoomLink;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Queries
{
    public class DeepZoomLinkQueryProfile : Profile
    {
        public DeepZoomLinkQueryProfile()
        {
            CreateMap<DeepZoomLinkDataTableFilterModelDto, DeepZoomLinkQuery>()
                 .ForMember(x => x.Sorter, opt => opt.MapFrom(y => y.GetOrderBy()));
        }
    }
}