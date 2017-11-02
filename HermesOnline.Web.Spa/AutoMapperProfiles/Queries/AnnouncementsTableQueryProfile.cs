using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos.Announcements;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Queries
{
    public class AnnouncementsTableQueryProfile : Profile
    {
        public AnnouncementsTableQueryProfile()
        {
            CreateMap<AnnouncementsTableFilterModelDto, AnnouncementQuery>()
                 .ForMember(x => x.Sorter, opt => opt.MapFrom(y => y.GetOrderBy())); ;
        }
    }
}