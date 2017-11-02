using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.Node;
using System.Linq;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Node
{
    public class CountryDtoProfile: Profile
    {
        public CountryDtoProfile()
        {
            CreateMap<Country, CountryDto>()
              .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
              .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Name))
              .ForMember(m => m.NumOfSites, opt => opt.MapFrom(src => src.Sites.Count(x => !x.IsDeleted && x.Turbines.Any(t => !t.IsDeleted))));
        }
    }
}