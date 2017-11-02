using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Service.Dto.QuickFilter;
using HermesOnline.Web.Spa.Dtos.QuickFilters;
using HermesOnline.Web.Spa.Dtos.QuickFilters.Feedback;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.QuickFilters
{
    public class FeedbackDataTableQuickFilterListDtoProfile : Profile
    {
        public FeedbackDataTableQuickFilterListDtoProfile()
        {
            CreateMap<IEnumerable<FeedbackDataTableQuickFilterDto>, FeedbackDataTableQuickFilterListDto>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Type.ToString(), Value = ((int)x.Type).ToString() })))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Category.ToString(), Value = ((int)x.Category).ToString() })))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Status.ToString(), Value = ((int)x.Status).ToString() })))
                .AfterMap<FeedbackDataTableQuickFilterListDtoProfileAfterMap>();
        }
    }

    public class FeedbackDataTableQuickFilterListDtoProfileAfterMap : IMappingAction<IEnumerable<FeedbackDataTableQuickFilterDto>, FeedbackDataTableQuickFilterListDto>
    {
        public void Process(IEnumerable<FeedbackDataTableQuickFilterDto> source, FeedbackDataTableQuickFilterListDto destination)
        {
            destination.Type = destination.Type.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Category = destination.Category.OrderBy(x => x.Display).DistinctBy(x => x.Display);
            destination.Status = destination.Status.OrderBy(x => x.Display).DistinctBy(x => x.Display);
        }
    }
}