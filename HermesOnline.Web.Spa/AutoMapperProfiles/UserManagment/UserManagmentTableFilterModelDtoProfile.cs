using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos.UserManagement;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.UserManagment
{
    public class UserManagmentTableFilterModelDtoProfile: Profile
    {
        public UserManagmentTableFilterModelDtoProfile()
        {           
            CreateMap<UserManagementTableFilterModelDto, UserQuery>()
                .ForMember(dest=> dest.Sorter, opt=> opt.MapFrom(y => y.GetOrderBy()));
        }
    }
}