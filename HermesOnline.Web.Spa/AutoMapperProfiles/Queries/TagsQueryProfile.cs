using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos.Tags;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Queries
{
    public class TagQueryProfile: Profile
    {
        public TagQueryProfile()
        {
            CreateMap<TagsTableFilterModelDto, TagQuery>()
               .ForMember(x => x.Sorter, opt => opt.MapFrom(y => y.GetOrderBy()));
        }
    }
}