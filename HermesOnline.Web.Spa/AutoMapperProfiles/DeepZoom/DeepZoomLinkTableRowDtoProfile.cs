using AutoMapper;
using HermesOnline.Service.Dto;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.DeepZoomLink;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.DeepZoom
{
    public class DeepZoomLinkTableRowDtoProfile : Profile
    {
        private const string Unknown = "Unknown";

        public DeepZoomLinkTableRowDtoProfile()
        {
            CreateMap<DeepZoomRowDto, DeepZoomLinkTableRowDto>()
                .ForMember(dest => dest.Site, opt => opt.MapFrom(src => src.Site))
                .ForMember(dest => dest.TurbineSerialNumber, opt => opt.MapFrom(src => src.TurbineSerial))
                .ForMember(dest => dest.TurbineName, opt => opt.MapFrom(src => src.TurbineName))
                .ForMember(dest => dest.Blade, opt => opt.MapFrom(src => src.BladeSerialNumber))
                .ForMember(dest => dest.BladeId, opt => opt.MapFrom(src => src.BladeId))
                .ForMember(dest => dest.Surface, opt => opt.MapFrom(src => src.Surface))
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.InspectionType))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country))
                .ForMember(dest => dest.Region, opt => opt.MapFrom(src => src.Region))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country))
                .ForMember(dest => dest.Inspection, opt => opt.MapFrom(src => src.InspectionName))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.InspectionDate.GetFormattedDate(false)));
        }
    }
}