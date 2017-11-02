using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Glimpse.Core.Extensions;
using HermesOnline.Core.Extensions;
using HermesOnline.Service.Dto.QuickFilter;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.QuickFilters;
using HermesOnline.Web.Spa.Dtos.QuickFilters.Findings;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.QuickFilters
{
    public class FindingsDataTableQuickFilterListDtoProfile : Profile
    {
        public FindingsDataTableQuickFilterListDtoProfile()
        {
            CreateMap<IEnumerable<FindingsDataTableQuickFilterDto>, FindingsDataTableQuickFilterListDto>()
               .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Category, Value = x.Category })))
               .ForMember(dest => dest.Layer, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Layer.ToString(), Value = ((int)x.Layer).ToString() })))
               .ForMember(dest => dest.Severity, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = ((int)x.Severity).ToString(), Value = ((int)x.Severity).ToString() })))
               .ForMember(dest => dest.Blade, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Blade, Value = x.BladeId.ToString() })))
               .ForMember(dest => dest.Site, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Site, Value = x.SiteId.ToString() })))
               .ForMember(dest => dest.InspectionDate, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.InspectionDate.GetFormattedDate(false), Value = x.InspectionDate.ToString() })))
               .ForMember(dest => dest.InspectionType, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.InspectionType.ToString(), Value = ((int)x.InspectionType).ToString() })))
               .ForMember(dest => dest.InspectionCompany, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.InspectionCompany, Value = x.InspectionCompany })))
               .ForMember(dest => dest.TurbineType, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.TurbineType, Value = x.TurbineType })))
               .ForMember(dest => dest.Platform, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Platform, Value = x.Platform })))
               .ForMember(dest => dest.Surface, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Surface.ToString(), Value = ((int)x.Surface).ToString() })))
               .ForMember(dest => dest.TurbineName, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.TurbineName, Value = x.TurbineId.ToString() })))
               .ForMember(dest => dest.DataQuality, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.DataQuality.ToDescription(), Value = ((int)x.DataQuality).ToString() })))
               .AfterMap<FindingsDataTableQuickFilterListDtoAfterMap>();
        }
    }

    public class FindingsDataTableQuickFilterListDtoAfterMap : IMappingAction<IEnumerable<FindingsDataTableQuickFilterDto>, FindingsDataTableQuickFilterListDto>
    {
        public void Process(IEnumerable<FindingsDataTableQuickFilterDto> source, FindingsDataTableQuickFilterListDto destination)
        {
            destination.Category = destination.Category.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Layer = destination.Layer.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Severity = destination.Severity.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Blade = destination.Blade.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Site = destination.Site.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.InspectionDate = destination.InspectionDate.OrderByDescending(x => x.Value).DistinctBy(x => x.Display);
            destination.InspectionType = destination.InspectionType.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.InspectionCompany = destination.InspectionCompany.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Surface = destination.Surface.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.TurbineName = destination.TurbineName.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.TurbineType = destination.TurbineType.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Platform = destination.Platform.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.DataQuality = destination.DataQuality.OrderBy(x => x.Display).DistinctBy(x => x.Display);
        }
    }
}