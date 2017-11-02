using System;
using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Filters;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.CustomFilters
{
    public class CustomFiltersTableRowDtoProfile : Profile
    {
        public CustomFiltersTableRowDtoProfile()
        {
            CreateMap<Domain.CustomFilters.CustomFilter, CustomFiltersTableRowDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date.GetFormattedDate(false)))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

            CreateMap<CustomFilterDto, Domain.CustomFilters.CustomFilter>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.HasValue() ? new Guid(src.Id) : Guid.Empty))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.Values, opt => opt.MapFrom(src => src.Values))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

            CreateMap<Domain.CustomFilters.CustomFilter, CustomFilterDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Values, opt => opt.MapFrom(src => src.Values))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));
        }
    }
}