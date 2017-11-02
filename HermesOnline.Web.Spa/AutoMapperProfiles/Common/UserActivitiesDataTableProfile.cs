using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Domain.UserActivity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.UserManagement;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Common
{
    public class UserActivitiesDataTableProfile : Profile
    {
        public UserActivitiesDataTableProfile()
        {
            CreateMap<UserActivity, UserActivityTableRowDto>()
                .ForMember(dest => dest.ViewType, opt => opt.MapFrom(src => src.TabView.GetDescription()))
                .ForMember(dest => dest.ViewedOn, opt => opt.MapFrom(src => src.ExecutedOn.GetFormattedDate(true)))
                .ForMember(dest => dest.Filters, opt => opt.MapFrom(src => string.Empty))
                .ForMember(dest => dest.UrlFilter, opt => opt.MapFrom(src => src.UrlFilter))
                .AfterMap<UserActivityToUserActivityTableRowDtoAfterMap>();
        }

        private class UserActivityToUserActivityTableRowDtoAfterMap : IMappingAction<UserActivity, UserActivityTableRowDto>
        {
            private readonly IUserActivityApiService _userActivityService;

            public UserActivityToUserActivityTableRowDtoAfterMap(IUserActivityApiService userActivityService)
            {
                _userActivityService = userActivityService;
            }

            public void Process(UserActivity source, UserActivityTableRowDto destination)
            {
                destination.Path = _userActivityService.GetSelectedPath(source.NodeId, source.Type, source.RowId);
            }
        }
    }
}