using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Glimpse.Core.Extensions;
using HermesOnline.Core.Extensions;
using HermesOnline.Service.Dto.QuickFilter;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.QuickFilters;
using HermesOnline.Web.Spa.Dtos.QuickFilters.Findings;
using HermesOnline.Web.Spa.Dtos.QuickFilters.UserManagement;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.QuickFilters
{
    public class UserManagmentDataTableQuickFilterListDtoProfile : Profile
    {
        public UserManagmentDataTableQuickFilterListDtoProfile()
        {
            CreateMap<IEnumerable<UserDataTableQuickFilterDto>, UserManagementDataTableQuickFilterListDto>()
               .ForMember(dest => dest.Group, opt => opt.MapFrom(src => src.Select(x => new QuickFilterListItemDto { IsChecked = true, Display = x.Group, Value = x.GroupId.ToString() })))
               .AfterMap<UserManagementDataTableQuickFilterListDtoAfterMap>();
        }
    }

    public class UserManagementDataTableQuickFilterListDtoAfterMap : IMappingAction<IEnumerable<UserDataTableQuickFilterDto>, UserManagementDataTableQuickFilterListDto>
    {
        public void Process(IEnumerable<UserDataTableQuickFilterDto> source, UserManagementDataTableQuickFilterListDto destination)
        {
            destination.Group = destination.Group.OrderBy(x => x.Display).DistinctBy(x => x.Display);
        }
    }
}