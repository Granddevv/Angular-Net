using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Common
{
    public class IdTextProfile : Profile
    {
        public IdTextProfile()
        {
            CreateMap<Blade, IdText>()
               .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(m => m.Text, opt => opt.MapFrom(src => src.SerialNumber));

            CreateMap<Site, IdText>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name));

            CreateMap<Domain.Turbine, IdText>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name));

            CreateMap<Fleet, IdText>()
               .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name));

            CreateMap<Inspection, IdText>()
              .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
              .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name));
        }
    }
}