using System.Linq;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos;
using HermesOnline.Web.Spa.Dtos.Breadcrumb;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Breadcrumb
{
    public class BreadcrumbDtoProfile : Profile
    {
        public BreadcrumbDtoProfile()
        {
            CreateMap<Site, SiteBreadcrumbDto>()
                .ForMember(dest => dest.Region, opt => opt.MapFrom(src => new IdValue(src.Country.RegionId,src.Country.Region.Name)))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => new IdValue(src.CountyId, src.Country.Name)))
                .ForMember(dest => dest.TurbineCount, opt => opt.MapFrom(src => src.Turbines.Count(x => !x.IsDeleted && x.Blades.Any(y => y.Sequences.Any(m => m.Defects.Any(z => z.Severity != null))))))
                .ForMember(dest => dest.Site, opt => opt.MapFrom(src => new IdValue(src.Id, src.Name)));

            CreateMap<Domain.Turbine, TurbineBreadcrumbDto>()
                .ForMember(dest => dest.Region, opt => opt.MapFrom(src => new IdValue(src.Site.Country.RegionId, src.Site.Country.Region.Name)))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => new IdValue(src.Site.CountyId, src.Site.Country.Name)))
                .ForMember(dest => dest.Site, opt => opt.MapFrom(src => new IdValue(src.SiteId, src.Site.Name)))
                .ForMember(dest => dest.Turbine, opt => opt.MapFrom(src => new IdValue(src.Id, src.Name)));

            CreateMap<Domain.Blade, BladeBreadcrumbDto>()
                .ForMember(dest => dest.Region, opt => opt.MapFrom(src => new IdValue(src.Turbine.Site.Country.RegionId, (src.Turbine.Site.Country.Region.Name))))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => new IdValue(src.Turbine.Site.CountyId, src.Turbine.Site.Country.Name)))
                .ForMember(dest => dest.Site, opt => opt.MapFrom(src => new IdValue(src.Turbine.SiteId, src.Turbine.Site.Name)))
                .ForMember(dest => dest.Turbine, opt => opt.MapFrom(src => new IdValue(src.TurbineId, src.Turbine.Name)))
                .ForMember(dest => dest.Blade, opt => opt.MapFrom(src => new IdValue(src.Id, src.Name)));

            CreateMap<Defect, DefectBreadcrumbDto>()
                .ForMember(dest => dest.Region, opt => opt.MapFrom(src => new IdValue(src.Sequence.Blade.Turbine.Site.Country.RegionId, (src.Sequence.Blade.Turbine.Site.Country.Region.Name))))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => new IdValue(src.Sequence.Blade.Turbine.Site.CountyId, src.Sequence.Blade.Turbine.Site.Country.Name)))
                .ForMember(dest => dest.Site, opt => opt.MapFrom(src => new IdValue(src.Sequence.Blade.Turbine.SiteId, src.Sequence.Blade.Turbine.Site.Name)))
                .ForMember(dest => dest.Turbine, opt => opt.MapFrom(src => new IdValue(src.Sequence.Blade.TurbineId, src.Sequence.Blade.Turbine.Name)))
                .ForMember(dest => dest.Blade, opt => opt.MapFrom(src => new IdValue(src.Sequence.Blade.Id, src.Sequence.Blade.Name)))
                .ForMember(dest => dest.Surface, opt => opt.MapFrom(src => src.Surface.ToString()))
                .ForMember(dest => dest.SerialNumber, opt => opt.MapFrom(src => src.SerialNumber));
        }
    }
}