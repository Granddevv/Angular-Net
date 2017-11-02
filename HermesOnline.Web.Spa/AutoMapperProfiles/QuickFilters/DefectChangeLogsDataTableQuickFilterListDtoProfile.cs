using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Service.Dto.QuickFilter;
using HermesOnline.Web.Spa.Dtos.QuickFilters;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.QuickFilters
{
    public class DefectChangeLogsDataTableQuickFilterListDtoProfile : Profile
    {
        public DefectChangeLogsDataTableQuickFilterListDtoProfile()
        {
            CreateMap<IEnumerable<DefectChangeLogDataTableQuickFilterDto>, DefectChangeLogsDataTableQuickFilterListDto>()
               .ForMember(dest => dest.NewCategory, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.NewTypes.ToString(), Value = x.NewTypes.HasValue ? ((int)x.NewTypes).ToString() : null })))
               .ForMember(dest => dest.NewLayer, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.NewLayers.ToString() , Value = x.NewLayers.HasValue ? ((int)x.NewLayers).ToString() : null })))
               .ForMember(dest => dest.NewSeverity, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.NewSeverities.HasValue ? ((int)x.NewSeverities).ToString() : x.NewSeverities.ToString(), Value = x.NewSeverities.HasValue ? ((int)x.NewSeverities).ToString() : x.NewSeverities.ToString() })))
               .ForMember(dest => dest.OriginalCategory, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.OriginalTypes.ToString(), Value = ((int)x.OriginalTypes).ToString() })))
               .ForMember(dest => dest.OriginalLayer, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.OriginalLayers.ToString(), Value = ((int)x.OriginalLayers).ToString() })))
               .ForMember(dest => dest.OriganalSeverity, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = ((int)x.OriginalSeverities).ToString(), Value = ((int)x.OriginalSeverities).ToString() })))
               .ForMember(dest => dest.Site, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Site, Value = x.SiteId.ToString() })))
               .AfterMap<DefectChangeLogsDataTableQuickFilterListDtoAfterMap>();
        }
    }

    public class DefectChangeLogsDataTableQuickFilterListDtoAfterMap : IMappingAction<IEnumerable<DefectChangeLogDataTableQuickFilterDto>, DefectChangeLogsDataTableQuickFilterListDto>
    {
        public void Process(IEnumerable<DefectChangeLogDataTableQuickFilterDto> source, DefectChangeLogsDataTableQuickFilterListDto destination)
        {
            destination.NewCategory = destination.NewCategory.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.NewLayer = destination.NewLayer.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.NewSeverity = destination.NewSeverity.OrderBy(x => x.Value).DistinctBy(x => x.Display);
            destination.OriginalLayer = destination.OriginalLayer.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Site = destination.Site.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.OriganalSeverity = destination.OriganalSeverity.OrderBy(x => x.Value).DistinctBy(x => x.Display);
            destination.OriginalCategory = destination.OriginalCategory.OrderBy(x => x.Display).DistinctBy(x => x.Display);
        }
    }
}