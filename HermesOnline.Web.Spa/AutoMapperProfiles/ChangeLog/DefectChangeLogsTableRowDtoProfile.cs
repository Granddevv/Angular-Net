using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.ChangeLog;
using HermesOnline.Web.Spa.Dtos.Feedbacks;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.ChangeLog
{
    public class DefectChangeLogsTableRowDtoProfile : Profile
    {
        public DefectChangeLogsTableRowDtoProfile()
        {
            CreateMap<DefectChangeLog, DefectChangeLogsTableRowDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.DateModified, opt => opt.MapFrom(src => src.DateModified.GetFormattedDate(false)))
                .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
                .ForMember(dest => dest.Site, opt => opt.MapFrom(src => src.Defect.Sequence.Blade.Turbine.Site.Name))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.SerialNumber, opt => opt.MapFrom(src => src.Defect.SerialNumber))
                .ForMember(dest => dest.NewLayer, opt => opt.MapFrom(src => src.NewLayer))
                .ForMember(dest => dest.NewSeverity, opt => opt.MapFrom(src => src.NewSeverity.GetDesription()))
                .ForMember(dest => dest.NewType, opt => opt.MapFrom(src => src.NewType))
                .ForMember(dest => dest.OriginalLayer, opt => opt.MapFrom(src => src.OriginalLayer))
                .ForMember(dest => dest.OriginalSeverity, opt => opt.MapFrom(src => src.OriginalSeverity.GetDesription()))
                .ForMember(dest => dest.OriginalType, opt => opt.MapFrom(src => src.OriginalType))
                .ForMember(dest => dest.DefectId, opt => opt.MapFrom(src => src.Defect.Id));
        }
    }
}