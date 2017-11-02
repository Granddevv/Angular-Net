using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Findings;
using DefectDto = HermesOnline.Web.Spa.Dtos.Findings.DefectDto;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Finding
{
    public class DefectDtoProfile: Profile
    {
        public DefectDtoProfile()
        {
            CreateMap<Defect, DefectDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Severity, opt => opt.MapFrom(src => src.Severity.Value))
                .ForMember(dest => dest.PixelsPerMM, opt => opt.MapFrom(src => src.PixelsPerMM))
                .ForMember(dest => dest.Layer, opt => opt.MapFrom(src => src.Layer))
                .ForMember(dest => dest.SiteId, opt => opt.MapFrom(src => src.Sequence.Blade.Turbine.Site.Id))
                .ForMember(dest => dest.BladeId, opt => opt.MapFrom(src => src.Sequence.Blade.Id))
                .ForMember(dest => dest.Surface, opt => opt.MapFrom(src => src.Surface))
                .ForMember(dest => dest.SerialNumber, opt => opt.MapFrom(src => src.SerialNumber))
                .ForMember(dest => dest.Region, opt => opt.ResolveUsing(src => src.Sequence.Blade.Turbine.Site.Country.Region))
                .ForMember(dest => dest.Country, opt => opt.ResolveUsing(src => src.Sequence.Blade.Turbine.Site.Country))
                .ForMember(dest => dest.TurbineId, opt => opt.MapFrom(src => src.Sequence.Blade.Turbine.Id))
                .ForMember(dest => dest.DistanceToRoot, opt => opt.MapFrom(src => src.DistanceToRoot.GetFormattedValue()))
                .ForMember(dest => dest.AreaMM2, opt => opt.MapFrom(src => src.AreaMM2.GetFormattedValue()))
                .ForMember(dest => dest.LengthMM, opt => opt.MapFrom(src => src.LengthMM.GetFormattedValue()))
                .ForMember(dest => dest.IsInGroup, opt => opt.MapFrom(src => src.DefectGroupItem != null))
                .ForMember(dest => dest.GroupType, opt => opt.MapFrom(src => src.DefectGroupItem == null ? 0 : src.DefectGroupItem.DefectGroup.Type));

            CreateMap<Defect, DefectChangedQuality>()
               .ForMember(x => x.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(x => x.UpdatedQuality, opt => opt.MapFrom(src => src.DataQuality))
               .ForMember(x => x.SiteId, opt => opt.MapFrom(src => src.Sequence.Blade.Turbine.Site.Id));
        }
           
    }
}