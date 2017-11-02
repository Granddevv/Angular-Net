using AutoMapper;
using System.Linq;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.Node;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Node
{
    public class SiteDtoProfile: Profile
    {
        public SiteDtoProfile()
        {
            CreateMap<Site, SiteDto>()
               .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Name))
               .ForMember(m => m.NumOfTurbines, opt => opt.MapFrom(src => src.Turbines.Count(x => !x.IsDeleted && x.Blades.Any(y => y.Sequences.Any(m => m.Defects.Any(z => z.Severity != null))))));
        }
    }
}