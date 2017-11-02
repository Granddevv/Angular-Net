using AutoMapper;
using HermesOnline.Service.Dto;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Findings;
using Defect = HermesOnline.Domain.Defect;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Finding
{
    public class FindingsTableRowDtoProfile : Profile
    {
        public const string UnknownType = "UNKNOWN";

        public FindingsTableRowDtoProfile()
        {
            CreateMap<DefectRowDto, FindingsTableRowDto>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Name) ? src.Name : UnknownType))
                .ForMember(dest => dest.Layer, opt => opt.MapFrom(src => src.Layer.ToString()))
                .ForMember(dest => dest.Severity, opt => opt.MapFrom(src => src.Severity.HasValue ? src.Severity.Value.GetDesription() : UnknownType))
                .ForMember(dest => dest.Surface, opt => opt.MapFrom(src => src.Surface.ToString()))
                .ForMember(dest => dest.DistanceToRoot, opt => opt.MapFrom(src => src.DistanceToRoot.GetFormattedValue()))
                .ForMember(dest => dest.LengthMm, opt => opt.MapFrom(src => src.LengthMM.GetFormattedValue()))
                .ForMember(dest => dest.AreaMm2, opt => opt.MapFrom(src => src.AreaMM2.GetFormattedValue()))
                .ForMember(dest => dest.DistanceToTip, opt => opt.MapFrom(src => src.DistanceToTip.GetFormattedValue()))
                .ForMember(dest => dest.InspectionDate, opt => opt.MapFrom(src => src.InspectionDate.GetFormattedDate(false)))
                .ForMember(dest => dest.SerialNumber, opt => opt.MapFrom(src => src.SerialNumber))
                .ForMember(dest => dest.DataQuality, opt => opt.MapFrom(src => (int)src.DataQuality))
                .ForMember(dest => dest.SiteId, opt => opt.MapFrom(src => src.SiteId));

            CreateMap<FindingsTableRowDto, Defect>();

            CreateMap<Defect, FindingsTableRowDto>()
                 .ForMember(dest => dest.Severity, opt => opt.MapFrom(src => src.Severity.HasValue ? src.Severity.Value.GetDesription() : UnknownType))
                 .ForMember(dest => dest.Type, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Name) ? src.Name : UnknownType))
                 .ForMember(dest => dest.DataQuality, opt => opt.MapFrom(src => (int)src.DataQuality));
        }
    }
}
