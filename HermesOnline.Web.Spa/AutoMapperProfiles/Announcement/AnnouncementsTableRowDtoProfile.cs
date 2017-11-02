using AutoMapper;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Announcements;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Announcement
{
    public class AnnouncementsTableRowDtoProfile : Profile
    {
        public AnnouncementsTableRowDtoProfile()
        {
            CreateMap<Domain.General.Announcement, AnnouncementsTableRowDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date.GetFormattedDate(false)))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.FileName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description));
        }
    }
}