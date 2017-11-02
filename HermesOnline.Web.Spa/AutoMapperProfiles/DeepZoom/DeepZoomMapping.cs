using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Service.Dto;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.DeepZoom
{
    public class DeepZoomMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<DeepZoomLink, DeepZoomRowDto>()
                .ForMember(x => x.Country, opt => opt.MapFrom(k => k.Blade.Turbine.Site.Country.Name))
                .ForMember(x => x.Site, opt => opt.MapFrom(k => k.Blade.Turbine.Site.Name))
                .ForMember(x => x.TurbineSerial, opt => opt.MapFrom(k => k.Blade.Turbine.SerialNumber))
                .ForMember(x => x.TurbineName, opt => opt.MapFrom(k => k.Blade.Turbine.Name))
                .ForMember(x => x.BladeSerialNumber, opt => opt.MapFrom(k => k.Blade.SerialNumber))
                .ForMember(dest => dest.BladePosition, opt => opt.MapFrom(src => src.Blade.Position))
                .ForMember(dest => dest.Surface, opt => opt.MapFrom(src => src.Surface))
                .ForMember(dest => dest.BladeId, opt => opt.MapFrom(src => src.BladeId))
                .ForMember(dest => dest.InspectionDate, opt => opt.MapFrom(src => src.Inspection.Date))
                .ForMember(dest => dest.InspectionType, opt => opt.MapFrom(src => src.Inspection.Type))
                .ForMember(dest => dest.Region, opt => opt.MapFrom(src => src.Blade.Turbine.Site.Country.Region.Name))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Blade.Turbine.Site.Country.Name))
                .ForMember(dest => dest.InspectionName, opt => opt.MapFrom(src => src.Inspection.Name));                
        }
    }
}
