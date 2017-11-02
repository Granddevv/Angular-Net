using AutoMapper;
using HermesOnline.Service.Implementations;
using HermesOnline.Web.Spa.Dtos.RequestAccess;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Account
{
    public class RequestAccessDtoProfile : Profile
    {
        public RequestAccessDtoProfile()
        {
            CreateMap<RequestAccessDto, IdentityUser>()
                  .ForMember(view => view.Email, cfg => cfg.MapFrom(x => x.UserName));
        }
    }
}