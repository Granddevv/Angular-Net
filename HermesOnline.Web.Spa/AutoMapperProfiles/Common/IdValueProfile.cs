using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Common
{
    public class IdValueProfile : Profile
    {
        public IdValueProfile()
        {
            CreateMap<Domain.Blade, IdValue>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Value, opt => opt.MapFrom(src => src.SerialNumber));

            CreateMap<Site, IdValue>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Name));

            CreateMap<Domain.Turbine, IdValue>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Value, opt => opt.MapFrom(src => $"{src.Site.Name} - {src.Name}"));

            CreateMap<Country, IdValue>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Name));

            CreateMap<Region, IdValue>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Name));

            CreateMap<Fleet, IdValue>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Name));

            CreateMap<Inspection, IdValue>()
                .ForMember(m => m.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Name));
        }
    }
}