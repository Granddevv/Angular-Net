using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Common
{
    public class ImageDtoProfile: Profile
    {
        public ImageDtoProfile()
        {
            CreateMap<Image, ImageDto>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
             .ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.Height))
             .ForMember(dest => dest.PixelsPerMM, opt => opt.MapFrom(src => src.PixelsPerMM))
             .ForMember(dest => dest.IsRef, opt => opt.MapFrom(src => true))
             .ForMember(dest => dest.Width, opt => opt.MapFrom(src => src.Width));
        }
    }
}