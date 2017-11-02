using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Timeline;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Overview
{
    public class TimelineDtoProfile : Profile
    {
        public TimelineDtoProfile()
        {
            CreateMap<Defect, TimelineFindingDto>()
                .ForMember(m => m.DistanceToRoot, opt => opt.MapFrom(src => src.DistanceToRoot.GetFormattedValue()))
                .ForMember(m => m.ImageId, opt => opt.MapFrom(src => src.MainImage.Id))
                .ForMember(m => m.InspectionDate, opt => opt.MapFrom(src => src.Sequence.Inspection.Date.GetFormattedDate(false)));

            CreateMap<Inspection, TimelineInspectionDto>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.InspectionDate, opt => opt.MapFrom(src => src.Date.GetFormattedDate(false)))
                .ForMember(m => m.InspectionYear, opt => opt.MapFrom(src => src.Date.Value.Year));                
        }
    }
}