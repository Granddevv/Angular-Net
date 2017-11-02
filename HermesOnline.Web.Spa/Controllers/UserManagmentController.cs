using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Interfaces;
using HermesOnline.Web.Spa.Dtos.UserManagement;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Helpers;
using HermesOnline.Web.Spa.Dtos.QuickFilters.UserManagement;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.Common;
using HermesOnline.Service.Model;
using HermesOnline.Service.Dto;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/UserManagement")]
    [Authorize]
    [AuthorizationUser(Permission.UserManagementNavigation)]
    public class UserManagmentController : BaseController
    {
        #region Fields

        private readonly IUserManagementApiService _userManagementApiService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IFilterService _filterService;


        #endregion

        #region C'tor

        public UserManagmentController(IUserManagementApiService userManagementApiService, IMapper mapper, IEmailService emailService, IFilterService filterService)
        {
            _userManagementApiService = userManagementApiService;
            _mapper = mapper;
            _emailService = emailService;
            _filterService = filterService;
        }

        #endregion

        #region Api

        [Route("")]
        [HttpPost]
        public UserManagementTableDto GetAll(UserManagementTableFilterModelDto filter)
        {
            if (!CurrentUserId.HasValue)
            {
                throw new Exception("User is not logged in.");
            }

            var currentUser = _userManagementApiService.GetUserById(CurrentUserId.Value);

            UserQuery userQuery = _mapper.Map<UserQuery>(filter);
            IPagedList<User> users = _userManagementApiService.GetAllUsers(userQuery, currentUser.Email);
            List<UserManagementTableRowDto> rows = _mapper.Map<IEnumerable<User>, IEnumerable<UserManagementTableRowDto>>(users).ToList();

            return new UserManagementTableDto
            {
                UserManagmentTableRows = rows,
                TotalDisplayedRecords = users.TotalCount,
                TotalRecords = users.TotalCount
            };
        }

        [Route("Delete/{userId?}")]
        [HttpDelete]
        public HttpResponseMessage Delete(Guid userId)
        {
            User user = _userManagementApiService.GetUserById(userId);
            if (user != null)
            {
                ServiceResult serviceResult = _userManagementApiService.DeleteUser(user);
                return Request.CreateResponse(serviceResult.Succeeded ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Cannot find user");
            }
        }

        [Route("RevokeAccess/{userId?}")]
        [HttpGet]
        public HttpResponseMessage RevokeAccess(Guid userId)
        {
            User user = _userManagementApiService.GetUserById(userId);
            if (user != null)
            {
                user.IsActive = false;
                ServiceResult serviceResult = _userManagementApiService.UpdateUser(user);
                return Request.CreateResponse(serviceResult.Succeeded ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Cannot find user");
            }
        }

        [Route("AllowAccess/{userId?}")]
        [HttpGet]
        public HttpResponseMessage AllowAccess(Guid userId)
        {
            User user = _userManagementApiService.GetUserById(userId);
            if (user != null)
            {
                user.IsActive = true;
                ServiceResult serviceResult = _userManagementApiService.UpdateUser(user);

                if (serviceResult.Succeeded)
                {
                    SendAllowAccessEmail(user);
                }
                return Request.CreateResponse(serviceResult.Succeeded ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Cannot find user");
            }
        }

        [Route("EditUserManagment")]
        [HttpPost]
        public IHttpActionResult EditUserManagment(UserManagementTableRowDto model)
        {
            User user = _userManagementApiService.GetUserById(model.Id);
            if (user == null)
            {
                return BadRequest("Cannot find user");
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;

            ServiceResult result = _userManagementApiService.UpdateUser(user, model.GroupId);
            return CreateHttpActionResult(result);
            
        }

        [Route("Groups")]
        [HttpGet]
        public IEnumerable<IdValue> GetAllGroups()
        {
            var groups = _mapper.Map<IEnumerable<IdValue>>(_userManagementApiService.GetAllGroups().OrderBy(x => x.Order));
            return groups;
        }

        private void SendAllowAccessEmail(User user)
        {
            Email email = new Email();
            email.To.Add(user.Email);
            email.Subject = "HermesOnline - Access Request Was Approved";
            email.IsBodyHtml = true;

            string applicationUrl = LocalUrlHelper.GetApplicationUrl();

            string htmlTextMessage = "<!DOCTYPE html>" +
                       "<html>" +
                       "<head></head>" +
                       "<body>" +
                       $"<p>Dear {user.Email},<br/> You now have access to <a href='{applicationUrl}'> Hermes </a>. There are 3 types of user on Hermes with different access levels to Hermes features.<br/> Find more details about access levels and related trainings on <a href='https://workspace.wp.siemens.com/communities/10011362/SitePages/About%20Hermes.aspx'> Hermes support page. </a> <br/> Best regards, <br/> The Hermes team. </p>" +
                       "</body>" +
                       "</html>";

            email.Body = htmlTextMessage;

            _emailService.SendEmail(email);
        }

        [Route("QuickFilter")]
        [HttpPost]
        public UserManagementDataTableQuickFilterListDto GetQuickFilters(UserQuickFilterModel quickFilter)
        {
            var filterCriteria = _mapper.Map<UserQuery>(
                           new UserManagementTableFilterModelDto
                           {
                               QuickFilters = quickFilter
                           });

            return _mapper.Map<UserManagementDataTableQuickFilterListDto>(_filterService.GetUserManagementkDataTableQuickFilters(filterCriteria.Filter));
        }
        #endregion
    }
}
