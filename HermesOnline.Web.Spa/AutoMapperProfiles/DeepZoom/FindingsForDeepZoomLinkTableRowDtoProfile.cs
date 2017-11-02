using AutoMapper;
using HermesOnline.Service.Dto;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Findings;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.DeepZoom
{
    public class FindingsForDeepZoomLinkTableRowDtoProfile : Profile
    {
        public const string UnknownType = "UNKNOWN";

        public FindingsForDeepZoomLinkTableRowDtoProfile()
        {
            CreateMap<DefectRowDto, FindingsForDeepZoomLinkTableRowDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Name) ? src.Name : UnknownType))
                .ForMember(dest => dest.DistanceToRoot, opt => opt.MapFrom(src => src.DistanceToRoot.ToTwoDigitString()))
                .ForMember(dest => dest.Severity, opt => opt.MapFrom(src => src.Severity.HasValue ? src.Severity.Value.GetDesription() : UnknownType))
                .ForMember(dest => dest.LengthMm, opt => opt.MapFrom(src => src.LengthMM.ToTwoDigitString()))
                .ForMember(dest => dest.AreaMm2, opt => opt.MapFrom(src => src.AreaMM2.ToTwoDigitString()))
                .ForMember(dest => dest.SerialNumber, opt => opt.MapFrom(src => src.SerialNumber));
        }
    }
}