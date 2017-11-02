using AutoMapper;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Web.Spa.Dtos.Blades;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Overview
{
    public class BladeOverviewDtoProfile : Profile
    {
        public BladeOverviewDtoProfile()
        {
            CreateMap<BladeOverviewItemFilterModelDto, FindingsBladeOverviewItemFilterModel>();
        }
    }
}