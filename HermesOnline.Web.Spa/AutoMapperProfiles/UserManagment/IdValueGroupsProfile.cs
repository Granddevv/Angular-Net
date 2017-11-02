using AutoMapper;
using HermesOnline.Web.Spa.Dtos;
using HermesOnline.Domain.Identity;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.UserManagment
{
    public class IdValueGroupsProfile: Profile
    {
        public IdValueGroupsProfile()
        {
            CreateMap<Group, IdValue>()
                .ForMember(x => x.Value, opt => opt.MapFrom(x => x.Name))
                .ForMember(x => x.Id, opt => opt.MapFrom(x => x.Id));
        }
    }
}