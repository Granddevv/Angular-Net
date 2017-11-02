using System.Linq;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.Node;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Turbine
{
    public class TurbineDtoProfile: Profile
    {
        public TurbineDtoProfile()
        {
            CreateMap<Domain.Turbine, TurbineDto>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Name))
                .ForMember(m => m.Severity,
                    opt => opt.MapFrom(src => src.Blades.Max(x => x.Sequences.Max(y => y.Defects.Max(z => (int)z.Severity)))));
        }
    }
}