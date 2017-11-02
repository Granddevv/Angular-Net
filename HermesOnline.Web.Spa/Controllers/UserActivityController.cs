using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Domain.Identity;
using HermesOnline.Domain.UserActivity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Dtos.UserManagement;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/UserActivity")]
    [Authorize]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class UserActivityController : ApiController
    {
        private readonly IUserActivityApiService _userActivityService;
        private readonly IMapper _mapper;

        public UserActivityController(IUserActivityApiService userActivityService, IMapper mapper)
        {
            _userActivityService = userActivityService;
            _mapper = mapper;
        }

        [Route("")]
        [HttpGet]
        [AuthorizationUser(Permission.DashboardNavigation)]
        public IEnumerable<UserActivityTableRowDto> GetAll()
        {
            IEnumerable<UserActivity> activities = _userActivityService.GetUserActivities(new Guid(RequestContext.Principal.Identity.Name))
                 .OrderByDescending(x => x.ExecutedOn);
            var userActivityTableRows = _mapper.Map<IEnumerable<UserActivity>, IEnumerable<UserActivityTableRowDto>>(activities);

            return userActivityTableRows;
        }

        [Route("Save")]
        [HttpPost]
        public string Save(UserActivitySaveRequestDto request)
        {
            if (!request.Url.IsNullOrEmpty())
                _userActivityService.AddUserActivity(new Guid(RequestContext.Principal.Identity.Name), request.Url, request.NodeType, request.NodeId, request.TabView, request.RowId);
            return $"OK - {request.Url}";
        }
    }
}
