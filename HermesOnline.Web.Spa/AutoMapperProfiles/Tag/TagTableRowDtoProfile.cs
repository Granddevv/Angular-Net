using AutoMapper;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Tags;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Tag
{
    public class TagTableRowDtoProfile : Profile
    {
        public TagTableRowDtoProfile()
        {
            CreateMap<Domain.Tag.Tag, TagsTableRowDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ModifiedDate, opt => opt.MapFrom(src => src.ModifiedDate.GetFormattedDate(false)))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Color))
                .ForMember(dest => dest.ModifiedBy, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description));
        }
    }
}