using System.Linq;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.Node;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Node
{
    public class RegionDtoProfile: Profile
    {
        public RegionDtoProfile()
        {
            CreateMap<Region, RegionDto>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Name))
                .ForMember(m => m.NumOfSites, opt => opt.MapFrom(src => src.Countries.Where(x => !x.IsDeleted).SelectMany(c => c.Sites).Count(x => !x.IsDeleted && x.Turbines.Any(t => !t.IsDeleted))));
        }
    }
}