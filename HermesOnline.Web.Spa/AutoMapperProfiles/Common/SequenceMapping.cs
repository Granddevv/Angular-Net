using System;
using Aether.Utils.JSON;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Framework.Extensions;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Common
{
    public class SequenceMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<SequenceJsonData, Sequence>()
                .Ignore(dest => dest.SequenceType)
                .Ignore(dest => dest.AetherCaptureBreakdown)
                .AfterMap((sjs, s) =>
                {
                    s.Id = Guid.NewGuid();//todo: check?
                    s.AetherCaptureBreakdown = sjs.CaptureBreakdown;
                    SequenceType sequenceType;
                    s.SequenceType = Enum.TryParse(sjs.SequenceType, true, out sequenceType)
                        ? sequenceType
                        : SequenceType.Unknown;
                });

            CreateMap<Sequence, SequenceJsonData>()
                .ForMember(dest => dest.CaptureBreakdown, opt => opt.MapFrom(src => src.AetherCaptureBreakdown))
                .ForMember(dest => dest.UUID, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.InspectionRef, opt => opt.MapFrom(src => src.InspectionId));
        }
    }
}