using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Service.Dto.QuickFilter;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.QuickFilters;
using HermesOnline.Web.Spa.Dtos.QuickFilters.DeepZoomLink;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.QuickFilters
{
    public class DeepZoomLinkDataTableQuickFilterListDtoProfile : Profile
    {
        public DeepZoomLinkDataTableQuickFilterListDtoProfile()
        {
            CreateMap<IEnumerable<DeepZoomLinkDataTableQuickFilterDto>, DeepZoomLinkDataTableQuickFilterListDto>()
                .ForMember(dest => dest.Blade, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Blade, Value = x.BladeId.ToString() }) ))
                .ForMember(dest => dest.Site, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.SiteName, Value = x.SiteId.ToString()})))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Date.GetFormattedDate(false), Value = x.Date.ToString()})))
                .ForMember(dest => dest.Inspection, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Inspection, Value = x.Inspection })))
                .ForMember(dest => dest.PhotoSource, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.PhotoSource.ToString(), Value = ((int?)x.PhotoSource).ToString() })))
                .ForMember(dest => dest.Surface, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Surface.ToString(), Value = ((int)x.Surface).ToString() })))
                .ForMember(dest => dest.Turbine, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.TurbineName, Value = x.TurbineId.ToString() })))
                .ForMember(dest => dest.TurbineSerial, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.TurbineSerial, Value = x.TurbineSerial })))
                .ForMember(dest => dest.Region, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Region, Value = x.Region })))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Country, Value = x.Country})))
                .AfterMap<DeepZoomLinkDataTableQuickFilterListDtoAfterMap>();
        }
    }

    public class DeepZoomLinkDataTableQuickFilterListDtoAfterMap : IMappingAction<IEnumerable<DeepZoomLinkDataTableQuickFilterDto>, DeepZoomLinkDataTableQuickFilterListDto>
    {
        public void Process(IEnumerable<DeepZoomLinkDataTableQuickFilterDto> source, DeepZoomLinkDataTableQuickFilterListDto destination)
        {
            destination.Blade = destination.Blade.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Site = destination.Site.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Date = destination.Date.OrderByDescending(x => x.Value).DistinctBy(x => x.Display);
            destination.Inspection = destination.Inspection.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.PhotoSource = destination.PhotoSource.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Surface = destination.Surface.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Turbine = destination.Turbine.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.TurbineSerial = destination.TurbineSerial.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Region = destination.Region.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Country = destination.Country.OrderBy(x => x.Display).DistinctBy(x => x.Display);
        }
    }
}