using AutoMapper;
using HermesOnline.Domain;
using System;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Web.Spa.Dtos.SummaryView;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Overview
{
    public class SummaryViewDtoProfile : Profile
    {
        public SummaryViewDtoProfile()
        {
            CreateMap<Defect, SummaryViewDto>()
                .ForMember(m => m.Severity, opt => opt.MapFrom(src => src.Severity))
                .ForMember(m => m.MeterFromRoot, opt => opt.MapFrom(src => (int)Math.Floor(src.DistanceToRoot.Value) + 1));

            CreateMap<SummaryViewItemFilterModelDto, FindingsSummaryFilterModel>();

            CreateMap<SummaryViewFilterModelDto, FindingsQuery>();

        }
    }
}