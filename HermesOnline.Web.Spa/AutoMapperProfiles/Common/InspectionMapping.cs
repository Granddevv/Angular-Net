using System;
using Aether.Utils.JSON;
using AutoMapper;
using HermesOnline.Domain;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Common
{
    public class InspectionMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<InspectionJsonData, Inspection>()
                .ForMember(dest => dest.Date, src => src.MapFrom(d => d.InspectionDate))
                .ForMember(dest => dest.Id, src => src.MapFrom(d => new Guid(d.Id)))
                .AfterMap((src, dest) =>
                {
                    dest.Name = Inspection.ToFormatedInspectionName(src.InspectionDate, src.Company);
                });                

            CreateMap<Inspection, InspectionJsonData>()
                .ForMember(dest => dest.InspectionDate, opt => opt.MapFrom(src => src.Date));
        }
    }
}