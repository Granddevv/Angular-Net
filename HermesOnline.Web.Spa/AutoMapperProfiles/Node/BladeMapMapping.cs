using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.Blades;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Node
{
    public class BladeMapMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<Defect, BladeMapDefectDto>()
                .ForMember(m => m.BladeLength, opt => opt.MapFrom(src => src.Sequence.Blade.Length))
                .ForMember(m => m.BladeWidth, opt => opt.MapFrom(src => src.Sequence.Blade.Width));
        }
    }
}